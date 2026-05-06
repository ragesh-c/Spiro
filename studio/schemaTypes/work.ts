import { defineField, defineType } from 'sanity'

export const work = defineType({
  name: 'work',
  title: 'Case Study (Work)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'servicePillar',
      title: 'Service Pillar',
      type: 'string',
      options: {
        list: [
          { title: 'Content Production', value: 'content-production' },
          { title: 'Social Media Management', value: 'social-media-management' }
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessiblity.',
          validation: (Rule) => Rule.required(),
        })
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional Vimeo or YouTube embed URL',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'One or two sentences, shown on the card',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' }
      ],
      description: 'Full case study detail (optional)',
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "2.4M impressions"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'If true, appears in Selected Work on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'Controls order in the Work page grid',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'coverImage',
    },
  },
})
