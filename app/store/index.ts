import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { Route } from 'vue-router';
import Vue from 'vue';
import { getContent } from '@/utils';

export interface State {
  perPage: number;
  pages: Page[];
  posts: Post[];
  events: Event[];
  route?: Route;
}

// Initial State
export const appState = {
  perPage: 4,
  pages: [],
  posts: [],
  events: [],
};

export const mutations: MutationTree<State> = {
  SET_PAGES: (state, payload: Record<string, unknown>): void => {
    Vue.set(state, 'pages', payload);
  },
  SET_POSTS: (state, payload: Record<string, unknown>): void => {
    Vue.set(state, 'posts', payload);
  },
  SET_EVENTS: (state, payload: Record<string, unknown>): void => {
    Vue.set(state, 'events', payload);
  },
};

interface Actions<S, R> extends ActionTree<S, R> {
  GET_PAGES_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_POSTS_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_EVENTS_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  nuxtServerInit(context: ActionContext<S, R>): void;
}

export const actions: Actions<State, State> = {
  async GET_POSTS_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/blog/', false, /\.json$/);
    const posts = await getContent({ context, prefix: 'blog' });
    commit('SET_POSTS', posts);
  },
  async GET_EVENTS_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the events directory matching .json files
    const context = await require.context('@/content/events/', false, /\.json$/);
    const events = await getContent({ context, prefix: 'events' });
    commit('SET_EVENTS', events);
  },

  async GET_PAGES_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/pages/', false, /\.json$/);
    const pages = await getContent({
      context,
      prefix: 'pages',
    });
    commit('SET_PAGES', pages);
  },

  async nuxtServerInit({ dispatch }): Promise<void> {
    await Promise.all([
      dispatch('GET_PAGES_LIST'),
      dispatch('GET_POSTS_LIST'),
      dispatch('GET_EVENTS_LIST'),
    ]);
  },
};

export const state = (): State => ({
  ...appState,
});

export const strict = false;
