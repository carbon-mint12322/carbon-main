import Link from "next/link"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function TokenExpiredPage(props){
  return (
    <Box sx={{padding: 20}}>
      <Typography component="div" variant="body">
        Token expired. To login again, please
        <Link href="/public/login"><a>click here.</a></Link>
      </Typography>
    </Box >
  );
}

