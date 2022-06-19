import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from "react-native";
import { useQuery, useQueryClient } from "react-query";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import { MovieResponse, moviesApi } from './../api';
import Loader from "../components/Loader";
import HList from "../components/HList";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ListTitle = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-left: 30px;
`;
const ListContainer = styled.View`
    margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
    margin-bottom: 30px;
`;

const VSeparator = styled.View`
    width: 20px;
`;
const HSeparator = styled.View`
    width: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);
    const {
        isLoading: nowPlayingLoading,
        data: nowPlayingData,
    } = useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);
    const {
        isLoading: upcomingLoading,
        data: upcomingData,
    } = useQuery<MovieResponse>(["movies", "upcoming"], moviesApi.upcoming);
    const {
        isLoading: trendingLoading,
        data: trendingData,
    } = useQuery<MovieResponse>(["movies", "trending"], moviesApi.trending);
    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(["movies"]);
        setRefreshing(false);
    };
    const loading = nowPlayingLoading || upcomingLoading || trendingLoading;

    // console.log(Object.keys(nowPlayingData?.results[0]));
    // console.log(Object.values(nowPlayingData?.results[0]).map((v) => typeof v));

    return loading ? (
        <Loader>
            <ActivityIndicator size="large" />
        </Loader>
    ) : upcomingData ? (
        <FlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListHeaderComponent={
                <>
                    <Swiper
                        horizontal
                        loop
                        autoplay
                        autoplayTimeout={3.5}
                        showsPagination={false}
                        showsButtons={false}
                        containerStyle={{ marginBottom: 30, width: "100%", height: SCREEN_HEIGHT / 4 }}
                    >
                        {nowPlayingData?.results.map((movie) => (
                            <Slide
                                key={movie.id}
                                backdropPath={movie.backdrop_path || ""}
                                posterPath={movie.poster_path || ""}
                                originalTitle={movie.original_title}
                                voteAverage={movie.vote_average}
                                overview={movie.overview}
                            />

                        ))}
                    </Swiper>
                    {trendingData ? <HList title="Trending Movies" data={trendingData.results} /> : null}
                    <ComingSoonTitle>Coming soon</ComingSoonTitle>
                </>
            }


            data={upcomingData.results}
            keyExtractor={(item) => item.id + ""}
            ItemSeparatorComponent={HSeparator}
            renderItem={({ item }) => (
                <HMedia
                    posterPath={item.poster_path || ""}
                    originalTitle={item.original_title}
                    overview={item.overview}
                    releaseDate={item.release_date}
                />
            )}
        >
        </FlatList>
    ) : null;
};
export default Movies;