import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler


def stuff():
    df = pd.read_csv('dataset.csv')
    df.drop(columns=['Unnamed: 0'], axis=1, inplace=True)

    df['explicit'] = df['explicit'].astype(int)

    track_genres = df['track_genre'].unique()
    #print(track_genres)

    genre_nums = [i for i in range(0, len(track_genres))]
    #print(genre_nums)

    genre_dict = dict(zip(genre_nums, track_genres))
    #print(genre_dict)

    genres_25 = ['pop', 'rock', 'hip-hop', 'country', 'r-n-b', 'folk', 'jazz', 'heavy-metal', 'edm', 'soul', 'funk',
              'reggae', 'disco', 'punk-rock', 'classical', 'house', 'techno', 'indie', 'grunge', 'ambient', 'gospel',
              'latin', 'grime', 'trap', 'world-music']

    filtered_df = df[df['track_genre'].isin(track_genres)]
    filtered_df = filtered_df[['popularity', 'track_genre', 'duration_ms', 'explicit', 'danceability', 'energy', 'key', 'loudness', 
                               'speechiness', 'acousticness', 'liveness', 'valence', 'tempo', 'time_signature']]
    #print(filtered_df)


    final_df = filtered_df.groupby(['track_genre']).mean()
    print(final_df)

    cols = final_df.columns

    std_scaler = StandardScaler()
    std_scaled = std_scaler.fit_transform(final_df.to_numpy())
    std_scaled = pd.DataFrame(std_scaled, columns=cols)

    std_scaled['track_genre'] = std_scaled.index.to_series().map(genre_dict)
    print(std_scaled)

    mm_scaler = MinMaxScaler()
    mm_scaled = mm_scaler.fit_transform(final_df.to_numpy())
    mm_scaled = pd.DataFrame(mm_scaled, columns=cols)

    mm_scaled['track_genre'] = mm_scaled.index.to_series().map(genre_dict)
    print(mm_scaled)

    mm_scaled.to_csv('mm_scaled.csv', index=False)


def main():
    stuff()


if __name__ == '__main__':
    main()
