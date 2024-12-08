export interface User {
    id?: number;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    status: UserAccountStatus;
    password?: string;
    emailVerified: boolean;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
    languagePreference?: UserLanguage;
    learningStyle?: UserLearningStyle;
    aiResponse?: ResponseOption;
    learningDuration?: LearningSchedule;
    avatar?: AIAvatarMentor;
}

export enum UserAccountStatus {
    ACTIVE = 0,
    BANNED = 1,
}

export enum UserLearningStyle {
    ADHD = "adhd",
    FAST = "fast",
    AVERAGE = "average",
    SLOW = "slow",
}

export enum UserLanguage {
    ENGLISH = "english",
    YORUBA = "yoruba",
    PIDGIN = "pidgin",
    IGBO = "igbo",
}

export enum ResponseOption {
    ROAST_ME = "roast_me",
    SCARED =  "scared",
}

export enum LearningSchedule {
    ONE_WEEK = "one_week",
    ONE_MONTH = "one_month",
    TWO_MONTHS = "two_months",
    LEARN_AS_I_GO = "learn_as_i_go",
}

export enum AIAvatarMentor {
    TECH = "TechTobi",
    DIGITAL = "DigitalMama",
}
