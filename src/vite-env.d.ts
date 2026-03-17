/// <reference types="vite/client" />

declare module "*.jsx" {
    import { FC } from 'react';
    const component: FC<any>;
    export default component;
}
