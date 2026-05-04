import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // enables built-in auth (login, register, JWT)
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      // Only admins can change roles
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
  // Access control rules
  access: {
    // Anyone can register
    create: () => true,
    // Admins read all users, users read only themselves
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: { equals: user.id },
      }
    },
    // Only admins can update/delete any user
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
}

export default Users
