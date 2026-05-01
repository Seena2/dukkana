export interface category{
    id: string;
    name:string;
    description: string;
    slug: string;
    imageUrl:string | null;
    isActive:boolean;
    createdAt: Date;
    updatedAt:Date;
}