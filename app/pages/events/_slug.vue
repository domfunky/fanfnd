<template>
  <article class="event" :class="event.slug">
    <div class="py-8 md:py-16 text-center mx-auto">
      <h1 class="text-lg md:text-xl lg:text-4xl xl:text-6xl">
        {{ event.title }}
      </h1>
    </div>

    <div v-html="$md.render(event.content)" class="event__content markdown pt-4 md:pt-6 md:pb-24" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { MetaInfo } from 'vue-meta';

@Component({
  head(): MetaInfo {
    return {
      title: this.event.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.event.seoDescription,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.event.seoMetaImage,
        },
      ],
    };
  },
})
export default class EventPost extends Vue {
  event!: Post;

  async asyncData({ params, payload }): Promise<{ event: Post }> {
    if (payload) {
      return { event: payload };
    }

    try {
      const event = require(`@/content/events/${params.slug}.json`);

      return {
        event,
      };
    } catch (e) {
      throw new Error('Not found');
    }
  }
}
</script>
