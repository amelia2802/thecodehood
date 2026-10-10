import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IoLocationOutline, IoGlobeOutline } from "react-icons/io5";

export default function DisplayCard({ data, onSelectTech }) {
    if (!data) return null;

    const formatLabel = () => {
        const fmt = (data.format || data.type || "").toLowerCase();
        if (fmt === "online" || fmt === "remote") return "Online";
        if (fmt === "hybrid") return "Hybrid";
        if (fmt === "in_person" || fmt === "physical") return "In-Person";
        return fmt || "Community";
    };

    const locationLabel = () => {
        const parts = [];
        if (data.city) parts.push(data.city);
        if (data.state) parts.push(data.state);
        if (parts.length > 0) {
            const locStr = parts.join(", ");
            return data.postal_code || data.zip ? `${locStr} ${data.postal_code || data.zip}` : locStr;
        }
        if (data.country) return data.country;
        if ((data.format || data.type || "").toLowerCase() === "online") return "Worldwide / Online";
        return "Location TBA";
    };

    const isOnline = (data.format || data.type || "").toLowerCase() === "online" || !data.city;

    return (
        <Card
            className="flex flex-col justify-between w-full max-w-sm rounded-xl overflow-hidden border border-[#8b5b30]/20 shadow-md hover:shadow-lg transition-shadow duration-300 bg-[#fffdfa]"
            sx={{
                bgcolor: '#fffdfa',
                borderRadius: '16px',
                border: '1px solid rgba(139, 91, 48, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div>
                <div className="relative">
                    <CardMedia
                        sx={{ height: 160 }}
                        image={data.img || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop"}
                        title={data.name}
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                        {data.is_demo && (
                            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#5A321A]/85 text-[#e3ddd7] backdrop-blur-xs">
                                Demo Data
                            </span>
                        )}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#8b5b30] text-white">
                            {formatLabel()}
                        </span>
                    </div>
                </div>

                <CardContent className="flex flex-col gap-2 p-4">
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        className="font-bold text-[#402e32] leading-snug line-clamp-1"
                        sx={{ fontWeight: 700, color: '#402e32', fontSize: '1.2rem', mb: 0.5 }}
                    >
                        {data.name}
                    </Typography>

                    <div className="flex items-center gap-1.5 text-xs text-[#8b5b30] font-medium">
                        {isOnline ? (
                            <IoGlobeOutline className="text-sm shrink-0" />
                        ) : (
                            <IoLocationOutline className="text-sm shrink-0" />
                        )}
                        <span className="truncate">{locationLabel()}</span>
                    </div>

                    <Typography
                        variant="body2"
                        className="text-stone-600 line-clamp-3 text-sm mt-1"
                        sx={{ color: '#574843', minHeight: '3.6em' }}
                    >
                        {data.description || data.desc || "A welcoming tech community."}
                    </Typography>

                    {data.technologies && data.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#8b5b30]/10">
                            {data.technologies.map((tech) => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => onSelectTech && onSelectTech(tech)}
                                    title={`Filter by ${tech}`}
                                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#f2ebe4] hover:bg-[#e7dbce] text-[#5A321A] font-medium transition-colors cursor-pointer"
                                >
                                    #{tech}
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </div>

            <CardActions className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-[#8b5b30]/10 mt-auto">
                {data.website_url || data.url ? (
                    <Button
                        size="small"
                        component="a"
                        href={data.website_url || data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!bg-[#5A321A] hover:!bg-[#402413] !text-[#e3ddd7] !font-medium !rounded-lg !px-3 !py-1 !text-xs !normal-case"
                        variant="contained"
                    >
                        Join
                    </Button>
                ) : (
                    <div />
                )}

                {data.email && (
                    <Button
                        size="small"
                        component="a"
                        href={`mailto:${data.email}`}
                        className="!text-[#5A321A] hover:!bg-[#8b5b30]/10 !font-medium !rounded-lg !px-3 !py-1 !text-xs !normal-case"
                    >
                        Contact
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}