export type supported_hostname_t ='chan.sankakucomplex.com' | 'yande.re' | 'konachan.com' | 'konachan.net'

export interface MyStorage {
    fileNameFormat: string
    fileNameMaxLength: number
    tagSeparator: string
}

export type my_msg_t = 'AskTabToDownload' | 'DownloadLinkGotten'
export type MyMsg = MyMsg_AskTabToDownload | MyMsg_DownloadLinkGotten

export interface MyMsg_BASE {
    type: my_msg_t,
}
export interface MyMsg_AskTabToDownload { type: 'AskTabToDownload' }
export interface MyMsg_DownloadLinkGotten {
    type: 'DownloadLinkGotten',
    url: string
    filename: string
}

export interface Tag {
    /** in English / Roman alphabets */
    en: string,
    /** in Japanese */
    ja?: string,
    /** post count */
    count: number
}

export interface FileTags {
    copyright: Tag[],
    character: Tag[],
    artist: Tag[],
    studio: Tag[],
    general: Tag[],
}
export const SELECTOR = {
    tagClass: {
        copyright: '.tag-type-copyright',
        character: '.tag-type-character',
        artist: '.tag-type-artist',
        studio: '.tag-type-studio',
        general: '.tag-type-general',
    }
}

export class storageManager {
    static setSync (d: Partial<MyStorage>): void {
        browser.storage.sync.set(d)
    }
    static getSync (): Promise<MyStorage | null> {
        return browser.storage.sync.get().then((d) => {
            return d as unknown as MyStorage
        }).catch((err) => {
            console.error('Error when getting settings from browser.storage.sync:', err)
            return null
        })
    }
}

export class msgManager {
    static sendToTab <T extends MyMsg> (tabId: number, msg: T) {
        return browser.tabs.sendMessage(tabId, msg) as Promise<T | void>
    }
    static sendToBg <T extends MyMsg> (msg: T) {
        return browser.runtime.sendMessage(msg)
    }
}

export function isUrlSupported (url: string) {
    const urlObj = new URL(url + '')
    return [
        'chan.sankakucomplex.com',
        'yande.re',
        'konachan.com',
        'konachan.net',
    ].includes(urlObj.hostname) && urlObj.pathname.includes('/post/show/')
}
