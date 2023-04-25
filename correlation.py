import numpy as np
import pandas as pd

df = pd.read_csv('dataset.csv')
list_of_genres = df['track_genre'].unique()

df = df[['danceability', 'energy', 'loudness', 'speechiness', 'acousticness',
         'instrumentalness', 'liveness', 'track_genre', 'popularity']]

cov_df = pd.DataFrame(columns=['track_genre', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness',
                               'instrumentalness', 'liveness', 'popularity'])

for genre in list_of_genres:
    df2 = df[df['track_genre'] == genre]
    cov_df['count'] = len(df2)
    covariances = df2.corr()
    cov_df = cov_df.append(covariances['popularity'], ignore_index=True)

for i, r in cov_df.iterrows():
    cov_df.loc[i, 'track_genre'] = list_of_genres[i]


cov_df.drop(columns=['popularity'], axis=1, inplace=True)

cov_df.to_csv('correlations.csv', index=False)