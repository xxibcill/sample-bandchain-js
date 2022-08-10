import { 
    Card,
    CardContent,
    Typography
} from '@mui/material';

type props = {
    symbol: string
    rates: number
}

const DataCard = ({symbol, rates}:props) => {
    return(
        <Card sx={{ minWidth: 275, mx: 3 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                 {symbol}
                </Typography>

                <Typography sx={{ fontSize: 25 }} color="text.secondary" variant="h2">
                    {rates}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default DataCard