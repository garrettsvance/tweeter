# **Project Milestone #4 Part A - Data Access Layer**

## Requirements
### Part A - Data Access Layer
Add a data access layer to your server's design. Design and implement a set of DAO classes that support all of the database access needs of your server, as follows:

1. Define each DAO type using an interface that has no dependencies on a particular underlying database (i.e., the interfaces should be database agnostic). This will allow your server to be easily ported to a different database later if needed.
   - S3 should also have a DAO interface.
2. Modify your Service classes to use your DAOs to access the database (i.e., no more hard-coded dummy data).
3. Use the Abstract Factory pattern or Dependency Injection (not covered in class) to give your Service classes access to the DAO objects they need. Specifically, your Service classes should never call "new" to create a DAO, but instead call an abstract factory to create DAOs, or receive them through dependency injection. Your Service classes should be unaware of what particular database is being used.
4. Create a package of classes that implement your DAO interfaces using DynamoDB.
   - S3 should also be implemented using a DAO.
5. Design and create a set of DynamoDB tables and indexes to store all necessary data.
   - Your design should pre-compute the contents of every user's feed and store it in the database, rather than calculating user feeds dynamically. This will allow user feeds to be retrieved very quickly, and allow your server to meet the project performance requirements.
6. Your data access layer should also support the ability to upload user profile images to AWS S3. **(Look at the [FAQ](https://byu.instructure.com/courses/27157/pages/milestone-4-faq-typescript) under "How do I upload my image to s3" for code on how to do this)**
7. Your implementation should meet the "user and session management" requirements in the [project overview](https://byu.instructure.com/courses/27157/pages/course-project-2).  Articles about salting and hashing passwords can be found [here](https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/) and [here](https://blog.logrocket.com/password-hashing-node-js-bcrypt/). We recommend [using bcryptjs](https://www.npmjs.com/package/bcryptjs)for hashing your passwords. The second article shows how to use bcrypt. **Make sure when you install the library, that you install bcryptjs, not the bcrypt library shown in the article.** The one you are told to install in the article does not work with AWS lambdas. Make sure you also install @types/bcryptjs.
8. Avoid duplicating code by using inheritance, generic types, composition/delegation, Template Method pattern, Strategy pattern, passing functions as parameters, etc.
9. At least one tab should be populated with more than 10 items so we can test the scrolling behavior.
10. Make sure that error responses work. Now that we no longer use FakeData, this can be tested. The easiest to test is login. CORS will need to be enabled on the error responses, see [Project Milestone #3: API Design and Implementation](https://byu.instructure.com/courses/27157/assignments/965321) for details on how.

After completing Part A, you should have a fully functional system (client and server). However, your server will probably not meet all of the project performance requirements. This will be rectified in Part B.

**Note:** It is **NOT** required that tabs update dynamically while using the application. For example, if you follow or unfollow a user while the Followees tab is selected, it is not required that the change is immediately displayed in the Followees tab. However, if you navigate away from and then back to the Followees tab, the change should be displayed. Similarly, if you post a status while the Story tab is displayed, it is not required that the status appear in the Story tab until you navigate away from and then back to the Story tab.


## DynamoDB Notes
### DynamoDB Provisioned Capacity

- No matter what architecture you develop, your performance will be capped by the capacity you provision for writing to the feed table in DynamoDB.
- To learn about provisioned capacity for reads (RCUs), read the following: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html#ItemSizeCalculations.Reads
- To learn about provisioned capacity for writes (WCUs), read the following: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html#ItemSizeCalculations.Writes
- Batch writes will be more efficient than individual put-items, because you will have fewer network round trips. A batch-write operation is limited to 25 items. If you include 25 items, you will consume 25 write capacity units, as long as each item is no more than 1 KB in size.


### Minimizing AWS charges

There may be a small charge associated with this milestone, but to minimize this consider the following:
- The DynamoDB free usage tier is that your total RCU and total WCU both are 25 or under. If you exceed 25 WCU or RCU, you will be charged some amount. You can turn up WCU and RCU while testing and passing off (if needed) but turn it down otherwise to avoid getting charged for capacity you are not using.
- 
### AWS Notes
[Some gotchas for AWS and tips to avoid getting charged $$$](https://byu.instructure.com/courses/27157/pages/aws-account)