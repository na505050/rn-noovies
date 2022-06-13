import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isLoading } from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import { BlurView } from "expo-blur";
import { makeImgPath } from "../utils";
import { useColorScheme } from "react-native";

const API_KEY = "5dce6d21a6dda399669ed4fb16a2ee80";

const Container = styled.ScrollView`
`;
const View = styled.View`
    flex: 1;    
`;
const Loader = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const BgImg = styled.Image``;
const Poster = styled.Image`
    width: 100px;
    height: 160px;
    border-radius: 5px;
`;

const Title = styled.Text<{ isDark: boolean }>`
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => (props.isDark ? "white" : props.theme.textColor)};
`;
const Wrapper = styled.View`
    flex-direction: row;
    height: 100%;
    width: 90%;
    margin: 0 auto;
    justify-content: space-around;
    align-items: center;
`;
const Column = styled.View`
    width: 60%;
`;
const Overview = styled.Text<{ isDark: boolean }>`
    margin-top: 10px;
    color: ${(props) =>
        props.isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"};
`;
const Votes = styled(Overview)`
    font-size: 12px;
`;

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
    const isDark = useColorScheme() === "dark";
    const [isLoading, setLoading] = useState(true);
    const [nowPlaying, setNowPlaying] = useState([]);
    const getNowPlaying = async () => {
        const { results } = await (await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`)).json();
        setNowPlaying(results);
        setLoading(false);
    };
    useEffect(() => {
        getNowPlaying();
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
                    <View key={movie.id}>
                        <BgImg
                            style={StyleSheet.absoluteFill}
                            source={{ uri: makeImgPath(movie.backdrop_path) }}
                        />
                        <BlurView
                            tint={isDark ? "dark" : "light"}
                            intensity={95}
                            style={StyleSheet.absoluteFill}
                        >
                            <Wrapper>
                                <Poster source={{ uri: makeImgPath(movie.poster_path) }} />
                                <Column>
                                    <Title>{movie.original_title}</Title>
                                    {movie.vote_average > 0 ? (
                                        <Votes isDark={isDark}>⭐️ {movie.vote_average}/10</Votes>
                                    ) : null}
                                    <Overview isDark={isDark}>
                                        {movie.overview.slice(0, 100)}...
                                    </Overview>
                                </Column>
                            </Wrapper>
                        </BlurView>
                    </View>
                ))}
            </Swiper>

        </Container>
    );
};
export default Movies;