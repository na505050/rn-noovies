import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, Text, View } from "react-native";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Swiper from 'react-native-swiper';
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import { moviesApi } from './../api';

const queryClient = new QueryClient();



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



const VSeparator = styled.View`
    width: 20px;
`;
const HSeparator = styled.View`
    width: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
        "nowPlaying",
        moviesApi.nowPlaying
    );
    const { isLoading: upcomingLoading, data: upcomingData } = useQuery(
        "upcoming",
        moviesApi.upcoming
    );
    const { isLoading: trendingLoading, data: trendingData } = useQuery(
        "trending",
        moviesApi.trending
    );
    const onRefresh = async () => { };
    const renderVMedia = ({ item }) => (
        <VMedia
            posterPath={item.poster_path}
            originalTitle={item.original_title}
            voteAverage={item.vote_average}
        />
    );
    const renderHMedia = ({ item }) => (
        <HMedia
            posterPath={item.poster_path}
            originalTitle={item.original_title}
            overview={item.overview}
            releaseDate={item.release_date}
        />
    );

    const movieKeyExtractor = (item) => item.id + "";
    const loading = nowPlayingLoading || upcomingLoading || trendingLoading;

    return loading ? (
        <Loader>
            <ActivityIndicator size="large" />
        </Loader>
    ) : (
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
                        {nowPlayingData.results.map((movie) => (
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
                            data={trendingData.results}
                            keyExtractor={movieKeyExtractor}
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 20 }}
                            ItemSeparatorComponent={VSeparator}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderVMedia}
                        >
                        </TrendingScroll>

                    </ListContainer>
                    <ComingSoonTitle>Coming soon</ComingSoonTitle>
                </>
            }


            data={upcomingData.results}
            keyExtractor={movieKeyExtractor}
            ItemSeparatorComponent={HSeparator}
            renderItem={renderHMedia}
        >
        </FlatList>
    );
}
export default Movies;