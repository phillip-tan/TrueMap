import pandas as pd
import json
import logging

FILE_PATH = 'state_licensing_data.csv'


def get_days_until_expiration(state_ids, expiration_dates):
    today = pd.to_datetime('today')
    days_until_expiration = []

    for expiration_dt in expiration_dates:
        # compare to the same year since csv data might have fault year data.
        if expiration_dt.replace(year=2000) < today.replace(year=2000):
            days = (expiration_dt.replace(year=(today.year+1)) - today).days
        # if date-month is in the future from today, result should be negative.
        else:
            days = (today - expiration_dt.replace(year=(today.year))).days
        days_until_expiration.append(days)

    # get data in format {"05": 365, "17": 180, etc.}
    days_until_expiration_by_state = dict(zip(state_ids, days_until_expiration))

    return days_until_expiration_by_state


def main():
    dtype = {
        'name': 'str',
        'abbreviation': 'str',
        'state_id': 'str',
        'expiration_dt': str
    }
    state_licensing_df = pd.read_csv(FILE_PATH, dtype=dtype, parse_dates=['expiration_dt'])

    days_until_expiration_by_state = get_days_until_expiration(state_licensing_df.state_id, state_licensing_df.expiration_dt)

    state_licensing_data = {
        'days_until_expiration': days_until_expiration_by_state,
        'state_licensing_link': []
    }

    with open('state_licensing_data.json', 'w') as state_licensing_data_json:
        json.dump(state_licensing_data, state_licensing_data_json)

    print("Successfully created state licensing data!")



if __name__ == "__main__":
    main()
