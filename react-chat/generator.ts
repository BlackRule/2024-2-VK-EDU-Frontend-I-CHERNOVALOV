import { jsonToRuntypes } from 'json-to-runtypes'

// const jsonIn = "{\"password\":\"user101password\",\"username\":\"user101\"}"
//
// const typescript = jsonToRuntypes(JSON.parse(jsonIn))

const json = {
    "id": "f11cc822-8348-4460-929e-467f3a2af748",
    "text": "w",
    "voice": null,
    "chat": "84c2a020-6508-43b3-a6ce-6049c78d50e4",
    "files": [],
    "updated_at": null,
    "created_at": "2024-11-21T18:04:01.558874+03:00",
    "was_read_by": [],
    "sender": {
        "id": "cd72442c-9443-4a9b-a7f7-595882452f28",
        "username": "user101",
        "first_name": "string",
        "last_name": "string",
        "bio": "string",
        "avatar": null,
        "is_online": false,
        "last_online_at": "2024-11-16T15:21:29.389137+03:00"
    }
}
const typescript = jsonToRuntypes(json)

console.log(typescript)