import pandas as pd
import json

FILE_PATH = 'state_license_expirations.csv'


def create_expiration_days_dict(file_path):
    dtype = {
        'name': 'str',
        'abbreviation': 'str',
        'state_id': 'str',
        'expiration_dt': str
    }
    expiration_days_df = pd.read_csv(file_path, dtype=dtype, parse_dates=['expiration_dt'])
    for days in expiration_days_df.expiration_dt:
        print(days)
    #expiration_days_dict = dict(zip(expiration_days_df.state_id, expiration_days_df.days_until_expiration))

    return True


def main():
    expiration_days_dict = create_expiration_days_dict(FILE_PATH)
    print(expiration_days_dict)
    # with open('expiration_days.json', 'w') as expiration_days_json:
    #     json.dump(expiration_days_dict, expiration_days_json)
    #
    # print("Successfully created expiration_days.json")



if __name__ == "__main__":
    main()
