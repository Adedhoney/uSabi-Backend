import { IDatabase } from "@infrastructure/Database";
import { Video } from "@domain/Models/Video";

export interface IVideoRepository {
    addVideo(video: Video): Promise<Video>;
    getChapterVideo(videoId: string): Promise<Video>;
    updateChapterVideo(video: Partial<Video>): Promise<void>;
    getAllChapterVideos(chapterId: string): Promise<Video[]>;
    deleteVideo(videoId: string): Promise<void>;
}

export class VideoRepository implements IVideoRepository {
    constructor(private readonly db: IDatabase) {}

    async addVideo(video: Video): Promise<Video> {
        await this.db.execute(
	    `INSERT INTO videos (videoId, chapterId, title, duration, englishUrl,
				 yorubaUrl, igboUrl, pidginUrl, createdAt)`,
	    [
		video.videoId, video.chapterId,video.title, video.duration, video.englishUrl || null,
		video. yorubaUrl || null, video.igboUrl || null, video.pidginUrl || null, video.createdAt
	    ]
	);
	return video;
    }

    async getChapterVideo(videoId: string): Promise<Video> {
        const [video] = await this.db.execute(
	    `SELECT v.*
	    FROM videos as v
	    WHERE videoId=?`,
	    [videoId]
	);
	return video as Video;
    }

    async updateChapterVideo(video: Partial<Video>): Promise<void> {
	const keys = Object.keys(video);
	const values = Object.values(video);

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

	await this.db.execute(
	    `UPDATE videos
	    SET ${setClause}
	    WHERE videoId=?`,
	    [...values, video.videoId]
	);
    }

    async getAllChapterVideos(chapterId: string): Promise<Video[]> {
	const videos = await this.db.execute(
	    `SELECT v.*
	    FROM videos v
	    WHERE chapterId=?
	    ORDER BY v.createdAt DESC`,
	    [chapterId]
	);
	return videos as Video[];
    }

    async deleteVideo(videoId: string): Promise<void> {
	await this.db.execute(
	    `DELETE FROM videos
	    WHERE videoId=?`,
	    [videoId]
	);
    }
}
