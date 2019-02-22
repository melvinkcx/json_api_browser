# Instruction

Before running this app, make sure the backend supports CORS request.
This is necessary as in development mode, both react and django apps are 
running on different ports.

In my case, I installed `django-cors-header` following this [guide](https://github.com/OttoYiu/django-cors-headers).

> Backend Endpoint: This app consumes `127.0.0.1:8000`, you can always update it in `src/constants.js`


# Design - Redux Store

Our redux store is composed of 3 parts/namespaces:

| namespace/reducer | purpose                                                                                   |
|-----------|-------------------------------------------------------------------------------------------|
| entity    | where all the entities (eg: blog, comment, etc) are store.                               |
| meta      | where all the app state is stored. Eg: currentDisplayEntity, currentPagination, etc.      |
| registry  | where list of available entities is stored. This is supposed to be obtained with `GET /`. |

This is how our initial redux state looks like:

```js
{
    entity: {
        entities: {
            /**
             * sample data:
             * blog : {
             *  [blogId]: { /blog dataObj/ }    // This structure facilitates CRUD in future
             * }
             */
        }
    },
    meta: {
        pagination: {
            page: 1,    // current page
            pages: 1,   // total pages
            count: 0,   // item count
        },
        links: {
            first: null,
            last: null,
            next: null,
            prev: null,
        },
        displayEntity: {
            loading: false,
            many: false,    // Value is an array ? many = true : many = false
            entityType: null,   // blog, etc
            entityIds: null // Value is an array or object
        },
    },
    registry: {
        entitiesRegistered: []
    }
}

```


When a response is received, we store the `data` and any `included` data into our 
`entity store` based on the `type` (or `entityType`).

Eg: when a response of below is received, the app would store each part of the data into 
various parts of our redux store:

``` js
{
    "links": {  // ***  this will be stored into `store.meta.links`
        "first": "http://localhost:8000/entries?page%5Bnumber%5D=1",
        "last": "http://localhost:8000/entries?page%5Bnumber%5D=1",
        "next": null,
        "prev": null
    },
    "data": [
        {
            "type": "posts",    // *** this will be stored into `store.entity.entities.entry`
            "id": "1",
            "attributes": {
                "headline": "This is a test, this is only a test",
                "bodyText": "And this is the body text for the blog entry. To see comments included in this payload visit: /entries/1?include=comments",
                "pubDate": "2015-01-01",
                "modDate": "2015-04-05"
            },
            "relationships": {
                "blog": {
                    "data": {
                        "type": "blog",
                        "id": "1"
                    }
                },
                "blogHyperlinked": {
                    "links": {
                        "self": "http://localhost:8000/entries/1/relationships/blog_hyperlinked",
                        "related": "http://localhost:8000/entries/1/blog"
                    }
                },
                "authors": {
                    "meta": {
                        "count": 1
                    },
                    "data": [
                        {
                            "type": "author",
                            "id": "1"
                        }
                    ]
                },
                "comments": {
                    "meta": {
                        "count": 1
                    },
                    "data": [
                        {
                            "type": "comment",
                            "id": "1"
                        }
                    ]
                },
                "commentsHyperlinked": {
                    "links": {
                        "self": "http://localhost:8000/entries/1/relationships/comments_hyperlinked",
                        "related": "http://localhost:8000/entries/1/comments"
                    }
                },
                "suggested": {
                    "links": {
                        "self": "http://localhost:8000/entries/1/relationships/suggested",
                        "related": "http://localhost:8000/entries/1/suggested/"
                    },
                    "data": [
                        {
                            "type": "entry",
                            "id": "2"
                        }
                    ]
                },
                "suggestedHyperlinked": {
                    "links": {
                        "self": "http://localhost:8000/entries/1/relationships/suggested_hyperlinked",
                        "related": "http://localhost:8000/entries/1/suggested/"
                    }
                },
                "tags": {
                    "data": []
                },
                "featuredHyperlinked": {
                    "links": {
                        "self": "http://localhost:8000/entries/1/relationships/featured_hyperlinked",
                        "related": "http://localhost:8000/entries/1/featured"
                    }
                }
            },
            "meta": {
                "bodyFormat": "text"
            }
        }
    ],
    "included": [
        {   // *** this will be stored into `store.entity.entities.comment
            "type": "comment",
            "id": "1",
            "attributes": {
                "body": "Love this article!"
            },
            "relationships": {
                "writer": {
                    "data": {
                        "type": "writers",
                        "id": "2"
                    }
                },
                "entry": {
                    "data": {
                        "type": "entry",
                        "id": "1"
                    }
                },
                "author": {
                    "data": {
                        "type": "author",
                        "id": "2"
                    }
                }
            }
        }
    ],
    "meta": {
        "pagination": { // *** this will be stored into `store.meta.pagination`
            "page": 1,
            "pages": 1,
            "count": 2
        }
    }
}
```

This is how our redux store looks like after inserting data:

![screenshot](https://i.postimg.cc/dt20mSwy/Deepin-Screenshot-select-area-20190222124639.png)


## How current display entity/item is stored?

In our redux store, we store the current app state in `store.meta`.

However, instead of storing the entire object as metadata, we store 
current entity type and id. 

Upon rendering, the component shall retrieve data from `store.entities`
using `currentEntityType` and `currentEntityIds`.


## Why do we need a registry?

In case we want to add extra entity/model in future, all we have to do is 
just simply update our registry. 


## How CRUD can easily be done?

Our entities are stored using associative array with the `entityId` as index. 

Eg:
```js
{
    entities: {
        blog: {
            1: {type, id, attributes...},
            2: {type, id, attributes...},
        }
    }
}
```

Using associative array makes data accessing more efficient, 
all we need is a pair of object keys (`entityType` and `entityId`).

Thus, in case of any CRUD, we can always update our store 
without having to traverse the entire collection of entities in
our redux store.


## How nested attributes are displayed in the UI?

The UI is designed in a way that retrieve data with this logic:

1. Search from redux store.
2. If not found -> retrieve from backend, then update the redux store.

In this way, we could prevent any unnecessary network request. 

