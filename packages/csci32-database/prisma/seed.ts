import { PrismaClient } from 'csci32-database'
const prisma = new PrismaClient()

async function main() {
  // Clear (children -> parents)
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()

  // Use any existing user to own seeded posts; don't author a new User in this lab.
  const [author] = await prisma.user.findMany({ select: { user_id: true }, take: 1 })
  if (!author) {
    console.warn('No users found. Skipping Post seed (needs at least one user to own posts).')
    return
  }

  const post1 = await prisma.post.create({
    data: { title: 'Hello', body: 'First post', authorId: author.user_id },
  })

  await prisma.comment.createMany({
    data: [
      { body: 'Great post!', postId: post1.id },
      { body: 'Thanks for sharing', postId: post1.id },
    ],
  })

  await prisma.post.create({
    data: {
      title: 'Nested Example',
      body: 'Created with comments',
      authorId: author.user_id,
      comments: { create: [{ body: 'Nice!' }, { body: 'Following.' }] },
    },
  })

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
