## ModelServices - API

### Used Boilerplate provided by.
https://www.npmjs.com/package/typescript-express-starter

## NOTE
Unfortunately, due to limited time no unit tests were implemented.

### Model design.
a separate collection has been designed to keep entity resource out of model collection. The reason is to avoid huge model documents in case many entities.
The assumption was that model is going to have many entities. Thus, to avoid issues with mongo single document MB limitation a separate collection has been
designed to hold entity data. There can be the same problem with attributes However, the assumption for attribute was that they are limited per entity.
NOTE: I have designed the model based on my above 2 assumptions.

Due to the separation of resources (Entity & Model):
  - Delta logic has been implemented manually. No library used.
  - mongo transactions has been applied to make sure in case of single operation fail the whole transaction will be failed.
    (To support mongodb transactions the database should run on at least single replica set. standalone won't work)

`NOTE`
  In case, the number of entities are going to be limited then another more easy approach could be applied.
  We could keep only one Model entity and have entities as subDocuments in a model document. In that case we could simplify
  patching procedure. Here is how. Using patching library patch can be applied on a document and save back as single doc.

### Commands to setup and run local mongodb with replica set.
  Install latest mongodb (Successfully, tested for mongo db version v4.4.4)
  Create a directory for mongo db.
  Modify `mongod.conf` file located in project root directory to set `dbPath` to point to the folder created above. (note ~ doesn't work. use pwd to copy the full path)
  As soon as directory is created and mongod.conf `dbPath` is updated navigate to project root folder and run: `mongod -f mongod.conf`
  If all successful and mongod is up and running without errors, please open another terminal and run `mongo`.
  After successfully connecting to database shell run `rs.initiate()` to initiate the new replica set.

  If everything is successful you should see similar response message.
```
> rs.initiate()
{
	"info2" : "no configuration specified. Using a default configuration for the set",
	"me" : "127.0.0.1:27017",
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1619962714, 1),
		"signature" : {
			"hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
			"keyId" : NumberLong(0)
		}
	},
	"operationTime" : Timestamp(1619962714, 1)
}
model-services-cluster:SECONDARY>

```
   Congratulations! you now have a single mongodb replica set running in your local machine.


### Starting the server

   running `npm install` && `npm run dev` to start node express server on your local machine.
   Open the browser on `http://localhost:3000/api-docs/` and api docs described by swagger should appear.

# Running Example test

 `npm run exampleTest` runs required 3 steps.
   - ﬁrst create a model based on the previously speciﬁed JSON.
   - then removes the entity called Company
   - then changes the value of the attribute name of entity WebSite
 `NOTE` The same steps can be done using Frontend app.

### Delta Operations
```
  { op: 'replace', path: '/name', value: 'Model new name' },

  // ENTITIES
  // Add Entity - accepts 'Entity Object'.
  { op: 'add', path: '/entities', value: { name: 'Entity Name', attributes: [{ name: 'Attr 1', type: 'number'}, { name: 'Attr 2', type: 'string'}, { name: 'Attr 3', type: 'number'}] } },

  { op: 'remove', path: '/entities/:entityId' },

  // Replace Entity - accepts the same object as `Add Entity`. (Please have a look at 'Add Entity')
  { op: 'replace', path: '/entities/:entityId', value: { name: 'Replaced New Entity Name', attributes: [{ name: 'Attr 4', type: 'boolean'}, { name: 'Attr 3', type: 'number'}] } },
  { op: 'replace', path: '/entities/:entityId/name', value: 'Replaced New Entity Name' },

  // ENTITY ATTRIBUTES
  // Add Entity Attribute - accepts 'Attribute Object'.
  { op: 'add', path: '/entities/:entityId/attributes', value: { name: 'Attr 0', type: 'boolean' } },

  { op: 'remove', path: '/entities/:entityId/attributes/:attributeId' },

  { op: 'replace', path: '/entities/:entityId/attributes/:attributeId', value: { name: 'Replaced New Attr Name', type: 'Replaced New Attr Type' } },
  { op: 'replace', path: '/entities/:entityId/attributes/:attributeId/name', value: 'Replaced Only Attr Name' },
  { op: 'replace', path: '/entities/:entityId/attributes/:attributeId/type', value: 'Replaced Only Attr Type' },

  // ASSOCIATIONS
  // Add Association - accepts 'Association Object'.
  { op: 'add', path: '/associations', value: { name: 'Association 0', source: 'Entity Name From', target: 'Entity Name To' } },

  { op: 'remove', path: '/associations/:associationId' },

  // Replace Association - accepts 'Association Object'.
  { op: 'replace', path: '/associations/:associationId', value: { name: 'Replaced New Association Name', source: 'Replaced New Entity Source', target: 'Replaced New Entity Target' } },
  { op: 'replace', path: '/associations/:associationId/name', value: 'Replaced New Association Name' },
  { op: 'replace', path: '/associations/:associationId/source', value: 'Replaced New Entity Source' },
  { op: 'replace', path: '/associations/:associationId/target', value: 'Replaced New Entity Target' },
```
