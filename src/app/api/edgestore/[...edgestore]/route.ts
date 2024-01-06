import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

const router = es.router({
  myPublicImages: es.imageBucket(),
});

const handler = createEdgeStoreNextHandler({
  router,
});


export {handler as GET, handler as POST} 

export type Router = typeof router