import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  right: "10px",
  top: "9px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    let unmounted = false;
    async function fetchNews() {
      try {
        const response = await axios.get("http://localhost:3000/");
        if (!unmounted) {
          setLoading(false);
          setArticles(response.data.articles);
        }
      } catch (err) {}
    }
    fetchNews();
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    async function fetchNews() {
      setLoading(true);
      if (filter === "all") {
        try {
          const response = await axios.get("http://localhost:3000/");
          if (!unmounted) {
            setLoading(false);
            setArticles(response.data.articles);
          }
        } catch (error) {}
      } else {
        try {
          const response = await axios.get(
            `http://localhost:3000/filter/${filter}`
          );
          if (!unmounted) {
            setLoading(false);
            setArticles(response.data.articles);
          }
        } catch (err) {}
      }
    }
    if (filter) {
      fetchNews();
    }
    return () => {
      unmounted = true;
    };
  }, [filter]);
  // console.log(articles);

  const handleSubmit = async (event) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/search/${category}`
      );
      setArticles(response.data.articles);

      setLoading(false);
    } catch (err) {}
  };

  const onChange = (event) => {
    setCategory(event.target.value);
  };
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              News
            </Typography>
            <select
              name="Category"
              id="genre"
              style={{ margin: "0 30px", padding:"5px 10px" ,border:"none", outline: "none" }}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all"  >All</option>
              <option value="Technology" >Technology</option>
              <option value="Sports" >Sports</option>
              <option value="Business" >Business</option>
              <option value="Science" >Science</option>
              <option value="Entertainment" >Entertainment</option>
            </select>
            <Search style={{ marginLeft: "auto" }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={onChange}
                onKeyPress={(e) => handleKeypress(e)}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={2} style={{ margin: "10px 0 10px 0" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          articles.map((article, index) => {
            return (
              <Grid
                key={index}
                item
                xl={2}
                lg={3}
                md={3}
                xs={12}
                style={{ display: "flex" }}
              >
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    title={article.title}
                    subheader={article.publishedAt}
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={article.urlToImage}
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {article.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </>
  );
}
