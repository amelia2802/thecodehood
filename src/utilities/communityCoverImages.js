export const COMMUNITY_COVER_IMAGES = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1170&q=80',
];

const pageSeed = Math.floor(Math.random() * 0x7fffffff);

export function getCommunityCoverImage(community) {
    const identity = String(
        community?.id ??
        [community?.name, community?.city, community?.state].filter(Boolean).join(':') ??
        'community'
    );

    let hash = pageSeed;
    for (let index = 0; index < identity.length; index += 1) {
        hash = (hash * 31 + identity.charCodeAt(index)) >>> 0;
    }

    return COMMUNITY_COVER_IMAGES[hash % COMMUNITY_COVER_IMAGES.length];
}
