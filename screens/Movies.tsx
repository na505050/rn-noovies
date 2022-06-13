import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import Slide from "../components/Slide";

const API_KEY = "5dce6d21a6dda399669ed4fb16a2ee80";

const Container = styled.ScrollView`
`;

const Loader = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;



// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {

    const [isLoading, setLoading] = useState(true);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [tranding, setTranding] = useState([]);
    const getTranding = async () => {
        const { results } = await (
            await fetch(
                `https://api.themoviedb.org/3/tranding/movie/week?api_key=${API_KEY}&language=en-US&page=1&region=KR`
            )).json();
        setTranding(results);
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
        await Promise.all([getTranding(), getUpComing(), getNowPlaying()]);
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
                containerStyle={{ width: "100%", height: SCREEN_HEIGHT / 4 }}
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

        </Container>
    );
};
export default Movies;