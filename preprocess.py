import pandas as pd
import numpy as np


def stuff():
    df = pd.read_csv('dataset.csv')
    df.drop(columns=['Unnamed: 0'], axis=1, inplace=True)

    track_genres = df['track_genre'].unique()
    print(track_genres)

    genres = ['pop', 'rock', 'hip-hop', 'country', 'r-n-b', 'folk', 'jazz', 'heavy-metal', 'edm', 'soul', 'funk',
              'reggae', 'disco', 'punk-rock', 'classical', 'house', 'techno', 'indie', 'grunge', 'ambient', 'gospel',
              'latin', 'grime', 'trap', 'world-music']

    filtered_df = df[df['track_genre'].isin(genres)]
    filtered_df = filtered_df[['popularity', 'track_genre']]
    print(filtered_df)

    filtered_genres = filtered_df['track_genre'].unique()
    print(filtered_genres)

    final_df = filtered_df.groupby("track_genre").sum()/1000
    print(final_df)

    #final_df.to_csv('dataset2.csv')


def main():
    stuff()


if __name__ == '__main__':
    main()
