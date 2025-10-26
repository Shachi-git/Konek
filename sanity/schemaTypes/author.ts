import { defineField, defineType } from "sanity"
import { UserIcon } from 'lucide-react'

export const author = defineType({
name: 'author',
title: 'Author',
type: 'document',
icon: UserIcon,
fields: [
    defineField({
        name: 'id',
        type: 'string',
        readOnly: true,
    }),
    defineField({
        name: 'name',
        type: 'string',
    }),
    defineField({
        name: 'username',
        type: 'string',
    }),
    defineField({
        name: 'email',
        type: 'string',
    }),
    defineField({
        name: 'image',
        type: 'image',
        options: {
            hotspot: true,
        },
        }),
    defineField({
        name: 'bio',
        type: 'text',
    }),
    defineField({
      name: 'password',
      type: 'string',
      validation: Rule => Rule.min(8).warning('Password should be at least 8 characters'),
    }),
],
preview:{
    select: {
        title: 'name'
    }
}
}) 