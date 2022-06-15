import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from "react-native";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";

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
const TrendingScroll = styled.FlatList`
    margin-top: 20px;
`;
const ListContainer = styled.View`
    margin-bottom: 40px;
`;
const ComingSoonTitle = styled(ListTitle)`
    margin-bottom: 30px;
`;

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
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
    }, []);

    // const onRefresh = () => console.log("refresh");

    const onRefresh = async () => {
        console.log("refresh");
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    };

    return loading ? (
        <Loader>
            <ActivityIndicator size="large" />
        </Loader>
    ) : (
        <FlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListHeaderComponent={<>
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
                            backdropPath={movie.backdrop_path}
                            posterPath={movie.poster_path}
                            originalTitle={movie.original_title}
                            voteAverage={movie.vote_average}
                            overview={movie.overview}
                        />

                    ))}
                </Swiper>
                <ListContainer>
                    <ListTitle>Trending Movies</ListTitle>
                    <TrendingScroll
                        data={trending}
                        keyExtractor={(item) => item.id + ""}
                        horizontal
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VMedia
                                posterPath={item.poster_path}
                                originalTitle={item.original_title}
                                voteAverage={item.vote_average}
                            />
                        )}
                    >
                    </TrendingScroll>

                </ListContainer>
                <ComingSoonTitle>Coming soon</ComingSoonTitle>
            </>}


            data={upcoming}
            keyExtractor={(item) => item.id + ""}
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            renderItem={({ item }) => (<HMedia
                posterPath={item.poster_path}
                originalTitle={item.original_title}
                overview={item.overview}
                releaseDate={item.release_date}
            />
            )}
        >
        </FlatList>
    );
}
export default Movies;