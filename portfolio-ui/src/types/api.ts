export interface User {
    id: number;
    username: string;
    fullName: string;
    token: string;
    refreshToken?: string;
    roles: string[];
}

export interface AuthResponse {
    id: number;
    token: string;
    refreshToken: string;
    expiration: string;
    username: string;
    fullName: string;
    roles: string[];
}

export interface ProjectImage {
    id: number;
    imageUrl: string;
    projectId: number;
    altTextAr?: string;
    altTextEn?: string;
}

export interface Project {
    id: number;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    clientName: string;
    technologyStack: string; // Comma-separated string
    projectUrl?: string;
    githubUrl?: string;
    createdDate: string;
    category: string;
    isFeatured: boolean;
    displayOrder: number;
    showOnHome: boolean;
    images: ProjectImage[];
    imageUrls?: string[]; // Backwards compatibility if needed
}

export interface Skill {
    id: number;
    nameEn: string;
    nameAr: string;
    proficiency: number; // 0-100
    category: string;
    iconUrl?: string;
    yearsOfUse: number;
    displayOrder: number;
    isActive: boolean;
}

export interface Service {
    id: number;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    iconUrl?: string;
    displayOrder: number;
    isActive: boolean;
    showOnHome: boolean;
}

export interface BlogComment {
    id: number;
    authorName: string;
    content: string;
    createdAt: string;
    likeCount: number;
    isLikedByCurrentUser?: boolean;
    userId?: number;
    parentCommentId?: number;
    replies?: BlogComment[];
}

export interface BlogPost {
    id: number;
    titleEn: string;
    titleAr: string;
    contentEn: string;
    contentAr: string;
    summaryEn: string;
    summaryAr: string;
    slug: string;
    imageUrl: string;
    videoUrl?: string;
    audioUrl?: string;
    postType: 'text' | 'video' | 'audio' | 'short';
    publishedDate: string;
    viewCount: number;
    isPublished: boolean;
    isDraft?: boolean;
    readingTimeInMinutes: number;
    seoTitleEn: string;
    seoTitleAr: string;
    seoDescriptionEn: string;
    seoDescriptionAr: string;
    categoryId: number;
    categoryNameAr?: string;
    categoryNameEn?: string;
    categorySlug?: string;
    likeCount: number;
    dislikeCount: number;
    isLikedByCurrentUser?: boolean;
    comments?: BlogComment[];
}

export interface BlogCategory {
    id: number;
    nameAr: string;
    nameEn: string;
    slug: string;
    displayOrder: number;
    isActive: boolean;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    subject: string;
    message: string;
    preferredContactMethod?: string;
    sentDate: string;
    isRead: boolean;
}

export interface AboutData {
    id: number;
    fullNameEn: string;
    fullNameAr: string;
    bioEn: string;
    bioAr: string;
    positionEn: string;
    positionAr: string;
    heroGreetingAr: string;
    heroGreetingEn: string;
    heroBioAr?: string;
    heroBioEn?: string;
    ctaPrimaryTextAr: string;
    ctaPrimaryTextEn: string;
    ctaSecondaryTextAr: string;
    ctaSecondaryTextEn: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;

    // Stats
    yearsOfExperience: number;
    projectsCompleted: number;
    technologiesCount: number;
    certificatesCount: number;
    freelanceProjectsCount: number;

    // Extended About Page
    extendedBioAr: string;
    extendedBioEn: string;
    softSkillsAr: string;
    softSkillsEn: string;
    experienceDescriptionAr: string;
    experienceDescriptionEn: string;

    // About Page Visibility
    showHeroAbout: boolean;
    showExtendedBio: boolean;
    showSoftSkills: boolean;
    showExperience: boolean;
    showStats: boolean;

    // Home Page Visibility
    showServicesSection: boolean;
    showProjectsSection: boolean;
    showCertificationsSection: boolean;
    showBlogSection: boolean;
    showContactSection: boolean;

    imageUrl?: string;
    cvUrl?: string;

    // Hero Badges
    badge1Ar?: string;
    badge1En?: string;
    badge2Ar?: string;
    badge2En?: string;
    badge3Ar?: string;
    badge3En?: string;
    badge4Ar?: string;
    badge4En?: string;
    badge5Ar?: string;
    badge5En?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface SiteSection {
    id: number;
    sectionKey: string;
    titleAr: string;
    titleEn: string;
    routePath: string;
    iconName: string;
    isVisibleInNavbar: boolean;
    navbarOrder: number;
    isVisibleInHome: boolean;
    homeOrder: number;
}

export interface SocialLink {
    id: number;
    platform: string;
    url: string;
    iconName: string;
    displayOrder: number;
    isActive: boolean;
}

export interface Certification {
    id: number;
    titleAr: string;
    titleEn: string;
    issuerAr: string;
    issuerEn: string;
    platformType: string;
    customPlatformName?: string;
    platformLogoUrl?: string;
    certificateUrl?: string;
    issueDate: string;
    category: string;
    isFeatured: boolean;
    showOnHome: boolean;
    displayOrder: number;
    isActive: boolean;
}
