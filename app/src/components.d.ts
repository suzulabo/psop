/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { App } from "src/app/app";
export namespace Components {
    interface ApIcon {
        "icon": 'clipboard' | 'x' | 'shield-lock';
    }
    interface ApLoading {
    }
    interface AppEncrypt {
        "app": App;
    }
    interface AppHome {
        "app": App;
    }
    interface AppKeygen {
        "app": App;
    }
    interface AppRoot {
    }
}
declare global {
    interface HTMLApIconElement extends Components.ApIcon, HTMLStencilElement {
    }
    var HTMLApIconElement: {
        prototype: HTMLApIconElement;
        new (): HTMLApIconElement;
    };
    interface HTMLApLoadingElement extends Components.ApLoading, HTMLStencilElement {
    }
    var HTMLApLoadingElement: {
        prototype: HTMLApLoadingElement;
        new (): HTMLApLoadingElement;
    };
    interface HTMLAppEncryptElement extends Components.AppEncrypt, HTMLStencilElement {
    }
    var HTMLAppEncryptElement: {
        prototype: HTMLAppEncryptElement;
        new (): HTMLAppEncryptElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppKeygenElement extends Components.AppKeygen, HTMLStencilElement {
    }
    var HTMLAppKeygenElement: {
        prototype: HTMLAppKeygenElement;
        new (): HTMLAppKeygenElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLElementTagNameMap {
        "ap-icon": HTMLApIconElement;
        "ap-loading": HTMLApLoadingElement;
        "app-encrypt": HTMLAppEncryptElement;
        "app-home": HTMLAppHomeElement;
        "app-keygen": HTMLAppKeygenElement;
        "app-root": HTMLAppRootElement;
    }
}
declare namespace LocalJSX {
    interface ApIcon {
        "icon"?: 'clipboard' | 'x' | 'shield-lock';
    }
    interface ApLoading {
    }
    interface AppEncrypt {
        "app"?: App;
    }
    interface AppHome {
        "app"?: App;
    }
    interface AppKeygen {
        "app"?: App;
    }
    interface AppRoot {
    }
    interface IntrinsicElements {
        "ap-icon": ApIcon;
        "ap-loading": ApLoading;
        "app-encrypt": AppEncrypt;
        "app-home": AppHome;
        "app-keygen": AppKeygen;
        "app-root": AppRoot;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ap-icon": LocalJSX.ApIcon & JSXBase.HTMLAttributes<HTMLApIconElement>;
            "ap-loading": LocalJSX.ApLoading & JSXBase.HTMLAttributes<HTMLApLoadingElement>;
            "app-encrypt": LocalJSX.AppEncrypt & JSXBase.HTMLAttributes<HTMLAppEncryptElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-keygen": LocalJSX.AppKeygen & JSXBase.HTMLAttributes<HTMLAppKeygenElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
        }
    }
}
