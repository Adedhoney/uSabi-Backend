export interface Video {
    videoId: string;
    chapterId: string;
    title?: string;
    duration?: number;
    englishUrl?: string;
    yorubaUrl?: string;
    igboUrl?: string;
    pidginUrl?: string;
    createdAt: number;
    updatedAt?: number;
}
