import { PrismaClient } from '@prisma/client';
import { ROLES, ROLE_PERMISSIONS } from '../lib/roles';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create test admin user first
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      clerkId: 'test_clerk_id',
      email: 'admin@test.com',
      name: 'Test Admin',
    },
  });

  // Create all permissions first
  const allPermissions = new Set<string>();
  Object.values(ROLE_PERMISSIONS).forEach(permissions => {
    permissions.forEach(permission => allPermissions.add(permission));
  });

  console.log('Creating permissions...');
  const permissionPromises = Array.from(allPermissions).map(permissionName =>
    prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: {
        name: permissionName,
        description: `Permission for ${permissionName}`,
      },
    })
  );

  const createdPermissions = await Promise.all(permissionPromises);
  console.log(`Created ${createdPermissions.length} permissions`);

  // Create roles with their permissions
  console.log('Creating roles...');
  for (const role of ROLES) {
    try {
      await prisma.role.upsert({
        where: { slug: role.slug },
        update: {
          name: role.name,
          description: role.description,
          permissions: {
            set: [], // Clear existing permissions
            connect: (await Promise.all(
              role.permissions.map(async (permName) => {
                const perm = await prisma.permission.findUnique({
                  where: { name: permName },
                });
                return perm ? { id: perm.id } : null;
              })
            )).filter((p): p is { id: string } => p !== null),
          },
        },
        create: {
          name: role.name,
          slug: role.slug,
          description: role.description,
          creator: {
            connect: { id: adminUser.id },
          },
          permissions: {
            connect: (await Promise.all(
              role.permissions.map(async (permName) => {
                const perm = await prisma.permission.findUnique({
                  where: { name: permName },
                });
                return perm ? { id: perm.id } : null;
              })
            )).filter((p): p is { id: string } => p !== null),
          },
        },
      });
      console.log(`Created/updated role: ${role.name}`);
    } catch (error) {
      console.error(`Error creating/updating role ${role.name}:`, error);
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });