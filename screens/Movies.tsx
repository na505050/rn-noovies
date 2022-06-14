import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import Poster from "../components/Poster";
import Slide from "../components/Slide";

const API_KEY = "5dce6d21a6dda399669ed4fb16a2ee80";

const Container = styled.ScrollView`
`;

const Loader = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ListTitle = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-left: 30px;
`;

const TrendingScroll = styled.ScrollView`
    margin-top: 20px;
`;

const Movie = styled.View`
    margin-right: 20px;
    align-items: center;
`;

const Title = styled.Text`
    color: white;
    font-weight: 600;
    margin-top: 7px;
    margin-bottom: 5px;
`;
const Votes = styled.Text`
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;
`;

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {

    const [isLoading, setLoading] = useState(true);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [trending, setTrending] = useState([]);
    const getTrending = async () => {
        const { results } = await (
            await fetch(
                `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
            )).json();
        setTrending(results);
    };
    const getUpComing = async () => {
        const { results } = await (
            await fetch(
                `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=KR`
            )).json();
        setUpcoming(results);
    };
    const getNowPlaying = async () => {
        const { results } = await (
            await fetch(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`
            )).json();
        setNowPlaying(results);


    };
    const getData = async () => {
        await Promise.all([getTrending(), getUpComing(), getNowPlaying()]);
        setLoading(false);
    }
    useEffect(() => {
        getData();
    }, [])

    return isLoading ? (
        <Loader>
            <ActivityIndicator size="large" />
        </Loader>
    ) : (
        <Container>
            <Swiper
                horizontal
                loop
                autoplay
                autoplayTimeout={3.5}
                showsPagination={false}
                showsButtons={false}
                containerStyle={{ marginBottom: 30, width: "100%", height: SCREEN_HEIGHT / 4 }}
            >
                {nowPlaying.map((movie) => (
                    <Slide
                        key={movie.id}
                        backdrop_path={movie.backdrop_path}
                        poster_path={movie.poster_path}
                        original_title={movie.original_title}
                        vote_average={movie.vote_average}
                        overview={movie.overview}
                    />

                ))}
            </Swiper>
            <ListTitle>Trending Movies</ListTitle>
            <TrendingScroll
                contentContainerStyle={{ paddingLeft: 30 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {trending.map((movie) => (
                    <Movie key={movie.id}>
                        <Poster path={movie.poster_path} />
                        <Title>
                            {movie.original_title ? movie.original_title.slice(0, 13) : null}
                            {movie.original_title && movie.original_title.length > 13 ? "..." : null}
                        </Title>
                        <Votes>⭐️ {movie.vote_average}/10</Votes>
                    </Movie>

                ))}
            </TrendingScroll>

        </Container>
    );
};
export default Movies;