import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSkeleton = () => {
    return new PrismaClient().$extends(withAccelerate())
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSkeleton>;
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSkeleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma