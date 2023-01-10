import { Strapi4RequestParams } from "@nuxtjs/strapi/dist/runtime/types";
import { merge, has, isArray, head, forEach, isObject } from "lodash-es";
import { compareAsc } from "date-fns";

// Events
export const useEvents = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "events",
    merge(
      {
        sort: ["start_at:asc"],
        populate: [
          "localizations",
          "thumbnail",
          "projects",
          "projects.thumbnail",
        ],
      },
      params,
    ),
    (events) => events.map(processEvent),
  );
};

export const useEventBySlug = (
  slug: string,
  params: Strapi4RequestParams = {},
) => {
  return useFind(
    "events",
    merge(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: [
          "localizations",
          "images",
          "thumbnail",
          "projects",
          "projects.thumbnail",
          "backgroundImage",
          "cards.image",
          "cards.media",
          "localizations.cards.image",
          "localizations.cards.media",
        ],
      },
      params,
    ),
    (events) => events.map(processEvent)[0],
  );
};

export const useUpcomingEvent = async () => {
  const { data: upcomingEvents, error } = await useEvents({
    filters: { end_at: { $gt: today() } },
  });
  const data = computed(() => {
    return upcomingEvents?.value?.filter((event) => {
      const { urgency } = useDatetime(event.start_at, event.end_at);
      return (
        urgency.value === "future" ||
        urgency.value === "soon" ||
        urgency.value === "now"
      );
    })[0];
  });
  // TODO Avoid duplication of useDatetime()
  const formattedStartAtDistance = computed(() =>
    data.value?.start_at
      ? useFormattedDistance(new Date(data.value.start_at))
      : null,
  );
  const urgency = computed(() =>
    data.value?.start_at && data.value?.start_at
      ? useUrgency(new Date(data.value.start_at), new Date(data.value.end_at))
      : null,
  );

  return { data, error, formattedStartAtDistance, urgency };
};

// Projects

export const useProjects = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "projects",
    merge(
      {
        populate: [
          "localizations",
          "thumbnail",
          "events",
          "events.localizations",
          "events.thumbnail",
        ],
      },
      params,
    ),
    (projects) => projects.map(processProject).sort(sortProjects),
  );
};

export const useProjectBySlug = (
  slug: string,
  params: Strapi4RequestParams = {},
) => {
  return useFind(
    "projects",
    merge(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: [
          "localizations",
          "images",
          "thumbnail",
          "events",
          "events.thumbnail",
          "backgroundImage",
          "video",
        ],
      },
      params,
    ),
    (projects) => projects.map(processProject)[0],
  );
};

// Pages
export const useFrontPage = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "frontpage",
    merge(
      {
        populate: [
          "localizations",
          "background",
          "events",
          "events.thumbnail",
          "events.images",
          "events.projects",
          "events.localizations",
          "events",
          "projects",
          "projects.thumbnail",
          "projects.images",
          "projects.projects",
          "projects.localizations",
        ],
      },
      params,
    ),
    processFrontPage,
  );
};

export const useAboutPage = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "about",
    merge(
      {
        populate: [
          "cards",
          "localizations.cards",
          "cards.image",
          "cards.media",
          "localizations.cards.image",
          "localizations.cards.media",
        ],
      },
      params,
    ),
    (data) => data,
  );
};

export const usePageBySlug = (
  slug: string,
  params: Strapi4RequestParams = {},
) => {
  return useFind(
    "pages",
    merge(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: ["localizations"],
      },
      params,
    ),
    (pages) => pages.map(processPage),
  ).then((res) => {
    res.data.value = res.data.value?.[0];
    return res;
  });
};

export const usePodcastPage = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "podcast",
    merge(
      {
        populate: ["localizations", "images"],
      },
      params,
    ),
    processPage,
  );
};

// Messages

export const useMessagesHistory = (params: Strapi4RequestParams = {}) => {
  return useFind("messages", merge({ sort: ["datetime:asc"] }, params));
};

// Blog

export const useBlogPosts = (params: Strapi4RequestParams = {}) => {
  return useFind(
    "blogs",
    merge(
      {
        populate: ["localizations", "thumbnail"],
      },
      params,
    ),
    (posts) => posts.map(processBlogPost),
  );
};

export const useBlogPostBySlug = (
  slug: string,
  params: Strapi4RequestParams = {},
) => {
  return useFind(
    "blogs",
    merge(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: ["localizations", "thumbnail", "backgroundImage"],
      },
      params,
    ),
    (posts) => posts.map(processBlogPost),
  ).then((res) => {
    res.data.value = res.data.value?.[0];
    return res;
  });
};

// Strapi request wrapper

export const useFind = (
  contentType: string,
  params?: Strapi4RequestParams,
  process = (data) => data,
) => {
  const { find } = useStrapi4();
  // We create an unique cache key based on function arguments
  const key = JSON.stringify({ contentType, ...params });
  return useAsyncData(key, () =>
    find(contentType, params)
      .then((res) => parseStrapi(res))
      .then(process),
  );
};

// Strapi result processing

export const processProjects = (result) => {
  result.data.value = result.data.value.map(processProject);
  return result;
};

export const processEvents = (result) => {
  result.data.value = result.data.value.map(processEvent);
  return result;
};

export const processFrontPage = (result) => {
  result = processLocalizations(result);
  result = proccessMarkdown(result);
  result.events = result.events ? result.events.map(processEvent) : null;
  if (result.events) {
    result.events = result.events.map((event) => {
      const { urgency } = useDatetime(event.start_at, event.end_at);

      const urgencyLabel = computed(() => {
        if (urgency.value === ("future" as Urgency)) {
          return ["upcoming", "tulemas"];
        } else if (urgency.value === ("soon" as Urgency)) {
          return ["soon", "varsti"];
        } else if (urgency.value === ("now" as Urgency)) {
          return ["live", "live"];
        } else {
          return ["new", "uus"];
        }
      });

      return { ...event, urgencyLabel };
    });
  }
  result.projects = result.projects
    ? result.projects.map(processProject)
    : null;
  return result;
};

export const processPage = (result) => {
  result = processLocalizations(result);
  result = proccessMarkdown(result);
  return result;
};

export const processBlogPost = (result) => {
  result = processLocalizations(result);
  result = proccessMarkdown(result);
  return result;
};

// Sorting

export function sortEvents(a: any, b: any) {
  if (a.start_at && b.start_at) {
    return compareAsc(new Date(b.start_at), new Date(a.start_at));
  }
  return 0; // Keep original sort order if no data for sorting
}

export function sortProjects(a: any, b: any) {
  if (a.events.length && b.events.length) {
    return compareAsc(
      new Date(b.events[0].start_at),
      new Date(a.events[0].start_at),
    );
  }
  if (a.created_at && b.created_at) {
    return compareAsc(new Date(b.created_at), new Date(a.created_at));
  }
  return 0; // Keep original sort order if no data for sorting
}

// Project and event processing

const processEvent = (event) => {
  const project = event.projects?.[0];
  event.projectLink = project ? `/projects/${project.slug}` : "/";
  event.eventLink = project ? `/projects/${project.slug}/${event.slug}` : "/";
  event.eventLiveLink = project
    ? `/projects/${project.slug}/${event.slug}/live`
    : "/";
  event.eventExperimentLink = project
    ? `/projects/${project.slug}/${event.slug}/experiment`
    : "/";
  event.projects = event.projects ? event.projects.map(processProject) : null;
  event = processLocalizations(event);
  event = proccessMarkdown(event);
  event = processEventVideostreams(event);
  return event;
};

const processAnthropologies = (event) => {
  event = processLocalizations(event);
  event = proccessMarkdown(event);
  return event;
};

const processProjectEvent = (event, project) => {
  event.projectLink = `/projects/${project.slug}`;
  event.eventLink = `/projects/${project.slug}/${event.slug}`;
  event.eventLiveLink = project
    ? `/projects/${project.slug}/${event.slug}/live`
    : "/";
  event.eventExperimentLink = project
    ? `/projects/${project.slug}/${event.slug}/experiment`
    : "/";
  const { urgency } = useDatetime(event.start_at, event.end_at);
  event.urgency = urgency.value;
  event = processLocalizations(event);
  event = proccessMarkdown(event);
  event = processEventVideostreams(event);
  return event;
};

const processProject = (project) => {
  project.projectLink = `/projects/${project.slug}`;
  if (project.events) {
    project.events = project.events
      .map((event) => processProjectEvent(event, project))
      .sort(sortEvents);
  }
  project = processLocalizations(project);
  project = proccessMarkdown(project);
  return project;
};

// Processors

const processLocalizations = (item) => {
  // Add localizations:
  //
  // item.titles = ["Title","Pealkiri"]
  // ...
  //
  // They are used in components as follows:
  //
  // const lang = useLang()
  // {{ item.titles[lang] }}

  const keys = [
    ["titles", "title"],
    ["intros", "intro"],
    ["descriptions", "description"],
    ["detailss", "details"],
    ["contents", "content"],
    ["live_contents", "live_content"],
  ];
  keys.forEach(([multiple, single]) => {
    item[multiple] = [
      item[single] || null,
      item.localizations?.length && item.localizations[0][single]
        ? item.localizations[0][single]
        : item[single]
        ? item[single]
        : null,
    ];
  });
  return item;
};

const proccessMarkdown = (item) => {
  // item.titles = item.titles.map(parseMarkdown);
  item.descriptions = item.descriptions.map(parseMarkdown);
  item.intros = item.intros.map(parseMarkdown);
  item.detailss = item.detailss.map(parseMarkdown);
  item.contents = item.contents.map(parseMarkdown);
  item.live_contents = item.live_contents.map(parseMarkdown);
  return item;
};

const processEventVideostreams = (event) => {
  return { ...event, videostreams: getVideostreams(event.streamkey) };
};

// https://github.com/ComfortablyCoding/strapi-plugin-transformer/blob/master/server/services/transform-service.js
export const parseStrapi = (data) => {
  if (has(data, "attributes")) {
    return parseStrapi(removeObjectKey(data, "attributes"));
  }

  if (isArray(data) && data.length && has(head(data), "attributes")) {
    return data.map((e) => parseStrapi(e));
  }

  forEach(data, (value, key) => {
    if (!value) {
      return;
    }

    if (isObject(value)) {
      data[key] = parseStrapi(value);
    }

    if (isArray(value)) {
      data[key] = value.map((field) => parseStrapi(field));
    }

    if (has(value, "data")) {
      let relation = null;
      if (isObject(value.data)) {
        relation = parseStrapi(value.data);
      }

      if (isArray(value.data)) {
        relation = value.data.map((e) => parseStrapi(e));
      }

      data[key] = relation;
    }

    if (has(value, "id")) {
      data[key] = parseStrapi(value);
    }

    if (isArray(value) && has(head(value), "id")) {
      data[key] = value.map((p) => parseStrapi(p));
    }

    if (has(value, "provider")) {
      return;
    }

    if (isArray(value) && has(head(value), "provider")) {
      return;
    }
  });

  return data.data ? data.data : data;
};

const removeObjectKey = (object, key) => ({
  id: object.id,
  ...object[key],
});
