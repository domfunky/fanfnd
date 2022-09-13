<template>
  <section class="events">
    <div class="py-8 md:py-16 text-center">
      <h1 class="text-lg md:text-xl lg:text-4xl xl:text-6xl">events</h1>
      <h2 class="text-base md:text-lg lg:text-xl xl:text-2xl">
        Stay up to date with our fast moving event ecosystem...
      </h2>
    </div>

    <div class="flex flex-wrap md:-mx-4 pb-20">
      <div v-for="(event, index) in events" :key="index" class="w-full md:w-1/2 my-4 md:px-4">
        <div class="event">
          <nuxt-link :to="`/events/${event.slug}`">
            <!-- <img -->
            <!--   :alt="post.title" -->
            <!--   class="w-full" -->
            <!--   :src="post.featuredImage || 'https://source.unsplash.com/random/640x340'" -->
            <!-- /> -->
            <div class="p-6">
              <h2 class="text-2xl mb-2">{{ event.title }}</h2>

              <p class="text-base font-light">
                {{ event.excerpt }}
              </p>

              <h6 class="text-blue-600 mt-4 font-medium">Read more</h6>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { MetaInfo } from 'vue-meta';

const Pagination = () => import('@/components/commons/pagination.vue');

@Component({
  components: {
    Pagination,
  },

  head(): MetaInfo {
    return {
      title: 'Events',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Events index',
        },
      ],
    };
  },
})
export default class EventsIndex extends Vue {
  currentPage!: number;

  totalPages!: number;

  events: Event[] = [];

  async asyncData({ params, store }) {
    const page: number = params.page ? parseInt(params.page, 10) : 1;
    const { perPage }: { perPage: number } = store.state;
    const range = page * perPage;

    const events = store.state.events.filter((event, index) => {
      const indexPage = index + 1;
      return range - perPage < indexPage && indexPage <= range;
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(store.state.events.length / perPage),
      events: events || [],
    };
  }
}
</script>

<style lang="scss">
.events {
  .event {
    @apply shadow-md;
    transition: all 0.2s cubic-bezier(0.64, 0, 0.35, 1);
    &:hover {
      @apply shadow-xl;
    }
  }
}
</style>
