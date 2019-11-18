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
|expiration_date|datetime|*required*; defaults to 24 hours after sending|
|user_id|integer|*foreign key* and *required*; id of the user that made the request|

## API
#### Table of Contents
|Type|Path|Notes|
|--|--|--------|
|POST|`/api/auth/register`|register a new user|
|POST|`/api/auth/login`|login a user|
|&nbsp;|||
|GET|`/api/users/:user_id`|get user info; requires authorization|
|PUT|`/api/users/:user_id`|update user info; requires authorization|
|DELETE|`/api/users/:user_id`|delete a user account; requires authorization|
|&nbsp;|||
|GET|`/api/users/:user_id/conversations`|get user's sent messages; requires authorization|
|POST|`/api/users/:user_id/conversations`|create/send a new message|
|&nbsp;|||
|POST|`/api/conversations`|search for matching conversation; requires `name` and `code`|
|GET|`/api/conversations/:conversation_id`|get information about a message; requires authorization|
|PUT|`/api/conversations/:conversation_id`|update a message; (only expiration datetime)|
|DELETE|`/api/conversations/:conversation_id`|delete a sent message; (makes it expired)|