import { generateRandomId } from "@application/utilities";
import { Video } from "@domain/Models/Video";
import { IVideoRepository } from "@domain/Repositories/VideoRepository";

export interface IVideoService {
    uploadVideo(video: Omit<Video, 'videoId'>): Promise<Video>;
    updateVideo(video: Partial<Video>): Promise<void>;
    fetchVideo(videoId: string): Promise<Video>;
    fetchChapterVideos(chapterId: string): Promise<Video[]>;
    deleteVideo(videoId: string): Promise<void>;
}

export class VideoService implements IVideoService {
    constructor(private videoRepo: IVideoRepository) {}

    async uploadVideo(video: Omit<Video, 'videoId'>): Promise<Video> {
        const newVideo = {
            ...video,
	    videoId: generateRandomId(),
	}
	return await this.videoRepo.addVideo(newVideo);
    }

    async fetchVideo(videoId: string): Promise<Video> {
        return await this.videoRepo.getChapterVideo(videoId);
    }

    async fetchChapterVideos(chapterId: string): Promise<Video[]> {
        return await this.videoRepo.getAllChapterVideos(chapterId);
    }

    async updateVideo(video: Partial<Video>): Promise<void> {
        await this.videoRepo.updateChapterVideo(video);
    }

    async deleteVideo(videoId: string): Promise<void> {
        await this.videoRepo.deleteVideo(videoId);
    }
}
