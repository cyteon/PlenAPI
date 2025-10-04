# PlenAPI
A api collecting aviation data from various free sources

## Data Sources
adsbdb: aircraft registration information \
openflight: airline data \
ourairports: airport data \
opensky network: live flight data (for your own usage only)

## Live Flights Data
Due to the OpenSky Network terms of service, we (and you) are not allowed to redistribute data from them as you are granted a "non-exclusive, **non-transferable**, non-assignable, and terminable license". We will however still have the endpoints so you can access the data for **your own needs**.
To access this data, make a request with a head "Authorization: Bearer [token]" where the token is the env variable INTERNAL_API_TOKEN.
