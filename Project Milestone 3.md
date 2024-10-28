# **Project Milestone #3: API Design and Implementation**

## Overview
The Tweeter web application consists of 14 features. For this milestone, you will move the backend logic (the code that you should have placed in Service classes in milestone 2) into AWS using API Gateway and AWS Lambdas for all 14 features. To accomplish this, you will complete the following three major tasks:

1. **Create AWS Lambdas.** For each of the 14 features, you will create and deploy an AWS Lambda that returns the dummy data for that feature.
2. **Design and Implement your Web API.** The Web API consists of a set of endpoints your client will use to call your backend. You will implement the endpoints in AWS API Gateway (one for each application feature), connect each API endpoint to the appropriate lambda, and deploy the API so your client can access it.
3. **Modify your client to call each of your Web API endpoints.** Rather than using dummy data in the client as you did for milestone 2, you will modify your client-side service class methods to invoke the appropriate web API endpoint and return the data to your presenters. The data returned by each method will be the same as in milestone 2, but now instead of getting it from the FakeData class directly, your service class methods will get it from the Web API endpoints.
You will also write some integration tests as part of this milestone. We recommend that you work iteratively, feature-by-feature. 
Instead of doing each of the above steps one at a time, pick a feature, write a lambda for it that returns the dummy data, 
create and deploy the Web API endpoint for that feature in API Gateway, and then connect the client to the Web API endpoint 
for that feature by changing the associated client-side service class method to invoke the appropriate API endpoint. 
Repeat this process until all 14 features are done.

When you are through, you should not be accessing dummy data directly from your client (your lambdas will be returning the dummy data through the Web API instead), and each of your service class methods should be accessing an API endpoint.

## Design and Implementation
Although you should work iteratively, one feature at a time, we describe each of the major steps in separate sections below.

### Create AWS Lambdas
*Create the tweeter-server Module*
Before you create any AWS lambdas, you will need a place to put them. Create a tweeter-server module to hold your AWS lambdas. 
Your server module will need to have a dependency on your tweeter-shared module. 
The dependency should look like this (inside the dependencies attribute of your package.json): 
```"tweeter-shared": "file:../tweeter-shared",```

Your server module will need to have a tsconf.json file. This is the recommended contents of that file:
```
{
    "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
    }
}
```
[This video](https://www.youtube.com/watch?v=0gqQdWuRkTo&feature=youtu.be) demonstrates how to create your tweeter-server module.

*Implement the tweeter-server Module Code*
Your backend (tweeter-server module) should have the following code layers:

* The Lambda handler layer. This layer consists of one lambda for each of the 14 Web API endpoints.
* A services layer. This is a set of service classes to which your lambdas delegate requests. These services classes are a copy of the service classes you created in milestone 2 with some minor modifications. The service classes you created in milestone 2 are the ones that should exist on the server starting in this milestone. You will change the service class methods in the client to invoke the web API endpoints as described below.

**Note:** In the next milestone, you will add a layer of DAO classes for accessing a database.

Since there are 14 lambdas in this milestone (and 16 in milestone 4B), manually deploying them each time you create or 
update one will become tedious. We recommend using scripts to automate most or all of this process. 
A set of scripts you can use for this purpose can be found [here](https://byu.instructure.com/courses/27157/pages/server-scripts). You are welcome to use them "as is" or modify them to suit your needs.

**Note:** If you know how to use a tool like Terraform, or AWS CloudFormation to automate the deployment of your lambdas, 
you are welcome to use them instead of the provided scripts. Instruction on these tools is outside the scope of this class.

By the end of the next milestone (milestone 4A), your implementation is to meet the "user and session management" requirements 
in the [project overview](https://byu.instructure.com/courses/27157/pages/course-project-2).  For milestone 3 you may use hard coded credentials and a hard coded authentication token. 
However, your Web API design should include the ability to return an authentication token when a user logs in and pass 
an authentication token from client to server when Web API operations are called.

Test each lambda from within the AWS console before connecting it to an API endpoint.

[This video](https://www.youtube.com/watch?v=jBSdQYGKCVk&feature=youtu.be) demonstrates how to create, deploy, and test one of your lambdas.

## Design and Implement Your Web API
Your Web API will need to provide capabilities such as:

1. Sign up a user
2. Sign in a user
3. Follow a user
4. Determine if a user is currently following another user
5. Get a user's followers (must be paginated)
6. Post a status
7. etc.

This list includes about half of the necessary endpoints.  You will need to figure out the other half on your own.

**Note:** In a production application, you would use the POST method for Web API endpoints that create information, 
PUT for features that update information, DELETE for features that remove information, and GET for features that read 
information. You would also specify the authorization information in an authorization header, not in a JSON body. 
Although you may choose to do this, structuring your Web API this way will make API Gateway configuration **MUCH MORE 
DIFFICULT.** For this application, we recommend using POST for all of your endpoints and including the authorization 
information in the Json request body for requests that need an auth token.

When defining your API in the API Gateway, please do the following:

* Provide a description for each API **method** that you define. To do this:
  * For each method:
    * In the Resources tab, select the method.
    * In the upper right-hand corner of the console, click the "Update Documentation" button.
    * Edit the description
    * Click "Save", then "Close"
  * After your API is completed and you have added a description for each method, go to the Documentation tab on the left-hand panel.
  * All of your descriptions should be displayed.
  * In the upper-right-hand corner, click "Publish Documentation"
  * Select the Stage of the API that you will use.
  * Input any version number for your documentation.
  * Click "Publish"
  * Now, when you export your Swagger file for the API, it will include your descriptions for each method.
* For each method, ensure you have integration responses for all relevant HTTP status codes (eg, 200, 400, 500). [Here is an explanation of how to set up integration responses.](https://byu.instructure.com/courses/27157/pages/mapping-exceptions-to-error-codes-in-api-gateway)
* The API Gateway exercise shows how to enable CORS on a POST method, but this only enables CORS on 200 responses. You must setup CORS separately for each error response.
* The method response must have the Access-Control-Allow-Origin header. No value is specified for this header.

Connect each Web API endpoint to one of your lambdas and test each endpoint from API Gateway before attempting to access it from your web application.

[This video](https://www.youtube.com/watch?v=OXAgXWiz7e0&feature=youtu.be) shows you how to configure API Gateway. You can also refer to the API Gateway in-class exercise.

## Call Web API Endpoints from Your Client
Your client code should use **service** classes to handle calls to the backend services. You should already have these after completing milestone 2. For this milestone you will have two sets of services classes. One set will be on the server and will be invoked by your lambdas. These services classes were described in the "Create AWS Lambdas" section above.

For this milestone, you should add a **network layer** in your client code that contains the class(es) that directly communicate with your backend. Your network layer must include a ServerFacade class that implements the façade pattern. Your ServerFacade class should access another class (i.e. ClientCommunicator) that handles the actual network communication. You should update the client side Service classes to call methods on your ServerFacade to obtain data to return to the presenters instead of getting it directly from the FakeData class. After you complete milestone 3, there should be no use of the FakeData class in your client.

The following ClientCommunicator class demonstrates how to do a post. You may use or modify this code for use in your client.

**Note:** This code assumes you have created either a TweeterRequest class that all of your other requests will extend, or a TweeterRequest interface that all of your other requests will implement. It also assumes you have created a TweeterResponse class that all of your other responses will extend, or a TweeterResponse interface that all of your other responses will implement.
```
import { TweeterRequest, TweeterResponse } from "tweeter-shared";

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  public async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers
  ): Promise<RES> {
    if (headers && req) {
      headers.append("Content-type", "application/json");
    } else if (req) {
      headers = new Headers({
        "Content-type": "application/json",
      });
    }

    console.log(`The request body is '${JSON.stringify(req)}'`);

    const url = this.getUrl(endpoint);
    const params = this.getParams(
      "POST",
      headers,
      req ? JSON.stringify(req) : req
    );
    
    console.log(`Fetching '${url}' with params '${JSON.stringify(params)}'`);

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        const response: RES = await resp.json();
        return response;
      } else {
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Client communicator ${params.method} failed:\n${
          (error as Error).message
        }`
      );
    }
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(
    method: string,
    headers?: Headers,
    body?: BodyInit
  ): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
```

Inside your ServerFacade class, create a method for each API endpoint as shown here for getMoreFollowees.

**Note:** This code assumes you have PagedUserItemRequest and PagedUserItemResponse classes. These classes were created in the lambda demo video associated with this exercise. However, you may have refactored the code to eliminate duplication, which may mean you have replaced these classes with request and response classes that support both paged user and paged status requests by using a generic type. If so, you will need to update this code to use the appropriate request and response classes.
```
import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "TODO: Set this value.";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message);
    }
  }
}
```
Your client's network layer should reference **request** and **response** classes that model the data being passed to and from your backend. These should be placed in the tweeter-shared module as shown in the lambda demo video.

Note: In your Milestone 3 code, you may choose to instantiate the request objects in either your presenter classes or your service classes. The example ServerFacade code above assume they are instantiated by the presenter and passed as parameters to ServerFacade.

## Automated Testing
This section describes the automated tests you are to write:

1. Using the Jest testing framework, write automated INTEGRATION tests to verify that your client-side Server Facade class correctly communicates with your server. Your test code can directly call the ServerFacade class (ie, no need to involve Services or Presenters). The methods of your ServerFacade should be async so your tests will need to await the results of calling ServerFacade methods before testing expectations. Test the following features:
   * Register
   * GetFollowers
   * GetFollowingCount and/or GetFollowersCount
2. Using the Jest testing framework, write an INTEGRATION test for your client-side Service that returns a user's story pages (i.e., StatusService). Service methods are async so your tests will need to await the results of calling service methods before testing expectations. Your test should test the results of a successful story retrieval.
   ** Note:** you do NOT have to write tests for the other outcomes (i.e., failing not because of an exception, failing because of an exception).
3. The tests may throw a 'fetch not defined' error. fetch is called in the ClientCommunicator when contacting the server. To fix this, run npm i isomorphic-fetch, then in the top of the test file add 'import "isomorphic-fetch".
## Passoff
Pass off your project with a TA by the due date at the end of TA hours (you must be in the pass off queue 1 hour before the end of TA hours to guarantee pass off)
You can only pass off once.
If you pass off before the pass off day, you will get an additional 4% of extra credit in this assignment
## Submission
All of your documents will be submitted to the assignment: [Project Milestone #3 Documents](https://byu.instructure.com/courses/27157/assignments/965320)
Submit to Canvas a zip file containing your project in its current form. If your project is too big to upload to Canvas, you are probably including files that shouldn't be there. Only include files that you would version.
Submit to Canvas an exported YAML or JSON swagger file that describes your API.  To do this export, click on your stage, then the export tab. You will see the option to "export as swagger".
Submit to Canvas a PDF file containing a UML sequence diagram demonstrating what happens when a user successfully sends a status, including both client and server side objects.
Keep in mind that the asynchronous nature shown in the 2C diagram will still be present.
Don't forget to include how the API Gateway bridges the gap between your Client and Server objects
This diagram should start with the submitPost() call on your PostStatus component, and end with a displayInfoMessage call on the component's listener.

## Frequently Asked Questions
You can find a list of FAQs [here.](https://byu.instructure.com/courses/27157/pages/milestone-3-faq-typescript)

Performing debugging for this and future milestones will be more difficult, since the code runs in two different 
locations and has to communicate over the network. We've provided this article to help you figure out what's happening 
when something goes wrong: [Bugs Hate These 5 Network Debugging Tips (#2 will surprise you).](https://byu.instructure.com/courses/27157/pages/bugs-hate-these-5-network-debugging-tips-number-2-will-surprise-you)

## Passoff Rubric
* [20 points] There are 14 features in you application that should each now call the back-end.
  * 10 points for having correct functionality with dummy data
  * 10 points for each feature connecting to the back end
* [20 points] You should have the correct layering in your networking and back-end architecture.
  * 5 points Service calls ServerFacade
  * 5 points ServerFacade calls API Gateway (through ClientCommunicator or similar)
  * 5 points API Gateway triggers a Lambda Function which runs a handler in your server module
  * 5 points the handler delegates the request to the services in your server module (which for now will call the FakeData class)
* [10 points] Automated Testing
  * 10 points for implementing the specified tests, and the tests are working

Please make sure you've gone over and tried at least some of these tips before asking a TA for help. It makes their lives much easier when you've already found the source of the error, and often it will help you fix it on your own.