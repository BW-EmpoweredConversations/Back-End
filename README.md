# Back-End

## Schema
#### Users
|Field|Type|Notes|
|--|--|--------|
|id|integer|*primary key* and *autoincrements*|
|email|string|*required* and *unique*|
|password|string|*required*|
|name|string|*required*|
|phone_number|string|*required*|

#### Conversations
|Field|Type|Notes|
|--|--|--------|
|id|integer|*primary key* and *autoincrements*|
|name|string|*required*; name of the recipient|
|phone_number|string|*required*; phone number of the recipient|
|created_at|datetime|defaults to time of sending|
|expires_in|string|defaults to `24h`; uses [zeit/ms](https://github.com/zeit/ms) format|
|user_id|integer|*foreign key* and *required*; id of the user that made the request|

## API
Base Url: https://empoweredconversations.herokuapp.com

test account:
```json
{
    "email": "tester@email.com",
    "password": "password"
}
```
#### Table of Contents
|Type|Path|Notes|Example|
|--|--|--------|-|
|POST|`/api/auth/register`|register a new user|[link](#post-apiauthregister)|
|POST|`/api/auth/login`|login a user|[link](#post-apiauthlogin)|
|&nbsp;||||
|GET|`/api/users/:user_id`|get user info; requires authorization|[link](#get-apiusersuser_id)|
|PUT|`/api/users/:user_id`|update user info; requires authorization|[link](#put-apiusersuser_id)|
|DELETE|`/api/users/:user_id`|delete a user account; requires authorization|[link](#delete-apiusersuser_id)|
|&nbsp;||||
|GET|`/api/users/:user_id/conversations`|get user's sent messages; requires authorization|[link](#get-apiusersuser_idconversations)|
|POST|`/api/users/:user_id/conversations`|create/send a new message; requires authorization; sends recipient a text message|[link](#post-apiusersuser_idconversations)|
|&nbsp;||||
|POST|`/api/conversations`|search for matching conversation; requires `name` and `code`; sends user a text message|[link](#post-apiconversations)|
|GET|`/api/conversations/:conversation_id`|get information about a message; requires authorization|[link](#get-apiconversationsconversation_id)|
|PUT|`/api/conversations/:conversation_id`|update a message; (only expiration datetime); requires authorization|[link](#put-apiconversationsconversation_id)|
|DELETE|`/api/conversations/:conversation_id`|delete a sent message; (makes it expired); requires authorization|[link](#delete-apiconversationsconversation_id)|

## Examples
#### POST /api/auth/register
request data:
```json
{
	"email": "username@email.com",
	"password": "password",
	"name": "Name",
	"phone_number": "555-555-5555"
}
```
response data:
```json
{
    "user": {
        "id": 1,
        "email": "username@email.com",
        "name": "Name",
        "phone_number": "5555555555"
    },
    "authorization": "really.long.token"
}
```
#### POST /api/auth/login
request data:
```json
{
	"email": "username@email.com",
	"password": "password"
}
```
response data:
```json
{
    "user": {
        "id": 1,
        "email": "username@email.com",
        "name": "Name",
        "phone_number": "5555555555"
    },
    "authorization": "really.long.token"
}
```
#### GET /api/users/:user_id
response data
```json
{
    "id": 1,
    "email": "username@email.com",
    "name": "Name",
    "phone_number": "5555555555"
}
```
#### PUT /api/users/:user_id
request data
```json
{
    "phone_number": "(777)777-7777"
}
```
response data
```json
{
    "id": 1,
    "email": "username@email.com",
    "name": "Name",
    "phone_number": "7777777777"
}
```
#### DELETE /api/users/:user_id
response data
```
no content
```
#### GET /api/users/:user_id/conversations
response data
```json
[
    {
        "id": 1,
        "name": "Name",
        "phone_number": "5555555555",
        "expires": "2019-11-18T14:00:00.000Z",
        "user_id": 1
    },
    {
        "id": 2,
        "name": "Name",
        "phone_number": "7777777777",
        "expires": "2019-11-19T18:00:00.000Z",
        "user_id": 1
    }
]
```
#### POST /api/users/:user_id/conversations
request data
```json
{
    "name": "Name",
    "phone_number": "888-888-8888"
}
```
response data
```json
{
    "id": 1,
    "name": "Name",
    "phone_number": "8888888888",
    "expires": "2019-11-18T14:00:00.000Z",
    "user_id": 1
}
```
#### POST /api/conversations
request data
```json
{
    "name": "Name",
    "code": 1
}
```
response data
```json
{
    "id": 1,
    "message": "Thank you."
}
```
#### GET /api/conversations/:conversation_id
response data
```json
{
    "id": 1,
    "name": "Name",
    "phone_number": "8888888888",
    "expires": "2019-11-18T14:00:00.000Z",
    "user_id": 1
}
```
#### PUT /api/conversations/:conversation_id
request data
```json
{
    "expires": "2019-11-19T20:00:00.000Z",
}
```
response data
```json
{
    "id": 1,
    "name": "Name",
    "phone_number": "8888888888",
    "expires": "2019-11-19T20:00:00.000Z",
    "user_id": 1
}
```
#### DELETE /api/conversations/:conversation_id
response data
```
no content
```