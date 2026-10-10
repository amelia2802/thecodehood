import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function DisplayCard(){
    return(
        <Card className="max-w-86 px-3 py-3">
            <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Community Name
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Community Description
                </Typography>
            </CardContent>
            <Stack direction="row" spacing={1}>
                <Chip label="IRL/Virtual/Hybrid" />
                <Chip label="Type" variant="outlined" />
                <Chip label="Location" />
            </Stack>
            <CardActions>
                <Button size="small">Join</Button>
                <Button size="small">Contact</Button>
            </CardActions>
        </Card>
    )
}