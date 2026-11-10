import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IoLocationOutline, IoGlobeOutline,IoAtCircleOutline } from "react-icons/io5";


export default function DisplayCard({img,title,location,details,url,contact}){
    const card =(
        <React.Fragment>
            <CardMedia 
                sx={{height:200}}
                image={img}
            />
            <CardContent sx={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <Typography gutterBottom variant="h4" component="h4" sx={{fontSize:'1.5rem', textAlign:'center'}}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center',gap:'5px',jusifyContent:'flex-start' }}>
                    <IoLocationOutline /> {location}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {details}
                </Typography>
            </CardContent>
            <CardActions sx={{display:'flex',justifyContent:'space-between'}}>
                <Button size="small"><a href={url} target="_blank" rel="noopener noreferrer" className="card-contact"><IoGlobeOutline /> Join</a></Button>
                <Button size="small"><a href={contact} target="_blank" rel="noopener noreferrer" className="card-contact"><IoAtCircleOutline /> Contact</a></Button>
            </CardActions>
        </React.Fragment>
    );
    return(
        <Card variant="elevation">{card}</Card>
    )
}