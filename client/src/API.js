import React from 'react'
import './css/about.css'

class API extends React.Component {
  render() {
    return (
      <div className="API">
        <h1>API</h1>
    <ul>
        <li><a href="#users">User</a></li>
        <li><a href="#videos">Videos</a></li>
        <li><a href="#channels">Channels</a></li>
        <li><a href="#account">Account</a></li>
        <li><a href="#errors">Errors</a></li>
    </ul>
    <h1 id="users">Users</h1>
    <h2 id="warning">Warning: you must have admin role</h2>
    <h2>Get users</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/users</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>page (not required)</td>
            <td>Get users by page</td>
        </tr>
        <tr>
            <td>search (not required)</td>
            <td>Get users by title or part of title</td>
        </tr>
    </table>
    <p>Return: users(with pagination)</p>
    <h2>Add user</h2>
    <p>Method: POST</p>
    <p>Url: /api/v1/users</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>username</td>
            <td>Unique string</td>
        </tr>
        <tr>
            <td>password</td>
            <td>Very hard string</td>
        </tr>
        <tr>
            <td>fullname</td>
            <td>Some string</td>
        </tr>
    </table>
    <p>Return: created user</p>
    <h2>Get one user by his id</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/users/:id</p>
    <p>Params: No params</p>
    <p>Return: user</p>
    <h2>Update one user by his id</h2>
    <p>Method: PUT</p>
    <p>Url: /api/v1/users/:id</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>role</td>
            <td>0(User) or 1(Admin)</td>
        </tr>
        <tr>
            <td>fullname</td>
            <td>Some string</td>
        </tr>
    </table>
    <p>Return: No content</p>
    <h2>Delete one user by his id</h2>
    <p>Method: DELETE</p>
    <p>Url: /api/v1/users/:id</p>
    <p>Params: No params</p>
    <p>Return: No content</p>
    <h1 id="videos">Videos</h1>
    <h2>Get videos</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/videos</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>page (not required)</td>
            <td>Get videos by page</td>
        </tr>
        <tr>
            <td>search (not required)</td>
            <td>Get videos by title or part of title</td>
        </tr>
    </table>
    <p>Return: videos(with pagination)</p>
    <h2>Add video</h2>
    <p>Method: POST</p>
    <p>Url: /api/v1/videos</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>size</td>
            <td>positive number</td>
        </tr>
        <tr>
            <td>quality</td>
            <td>positive number</td>
        </tr>
        <tr>
            <td>title</td>
            <td>Some string</td>
        </tr>
        <tr>
            <td>videoUrl</td>
            <td>url to some video</td>
        </tr>
        <tr>
            <td>posterUrl</td>
            <td>url to some poster</td>
        </tr>
        <tr>
            <td>ch (not required)</td>
            <td>channel id which will have this video</td>
        </tr>
    </table>
    <p>Return: created video</p>
    <h2>Get one video by his id</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/videos/:id</p>
    <p>Params: No params</p>
    <h2>Update one video by his id</h2>
    <p>Method: PUT</p>
    <p>Url: /api/v1/videos/:id</p>
    <p>Params:</p>
    <table>
            <tr>
                <td>size</td>
                <td>positive number</td>
            </tr>
            <tr>
                <td>quality</td>
                <td>positive number</td>
            </tr>
            <tr>
                <td>title</td>
                <td>Some string</td>
            </tr>
    </table>
    <p>Return: No content</p>
    <h2>Delete one video by his id</h2>
    <p>Method: DELETE</p>
    <p>Url: /api/v1/videos/:id</p>
    <p>Params: No params</p>
    <p>Return: No content</p>
    <h1 id="channels">Channels</h1>
    <h2>Get channels</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/channels</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>page (not required)</td>
            <td>Get channels by page</td>
        </tr>
        <tr>
            <td>search (not required)</td>
            <td>Get channels by title or part of title</td>
        </tr>
    </table>
    <p>Return: channels(with pagination)</p>
    <h2>Add channel</h2>
    <p>Method: POST</p>
    <p>Url: /api/v1/channel</p>
    <p>Params:</p>
    <table>
        <tr>
            <td>title</td>
            <td>Some string</td>
        </tr>
        <tr>
            <td>chimgUrl</td>
            <td>url to some image</td>
        </tr>
    </table>
    <p>Return: created channel</p>
    <h2>Get one channel by his id</h2>
    <p>Method: GET</p>
    <p>Url: /api/v1/channels/:id</p>
    <p>Params: No params</p>
    <h2>Update one channel by his id</h2>
    <p>Method: PUT</p>
    <p>Url: /api/v1/channels/:id</p>
    <p>Params:</p>
    <table>
            <tr>
                <td>title</td>
                <td>Some string</td>
            </tr>
    </table>
    <p>Return: No content</p>
    <h2>Delete one channel by his id</h2>
    <p>Method: DELETE</p>
    <p>Url: /api/v1/channels/:id</p>
    <p>Params: No params</p>
    <p>Return: No content</p>
    <h1 id="account">Account</h1>
    <h2>Get user data</h2>
    <p>Method: GET</p>
    <p>Url: /developer/v1/</p>
    <p>Params: No params</p>
    <p>Return: user that login</p>
    <p>Method of authorization: header must have field Authorization: Basic value(username:password in Base64)</p>
    <h1 id="errors">Errors</h1>
    <p>400(username is already exist, page less then 0 or greater then pages</p>
    <p>401(You are not authorize)</p>
    <p>403(You are not admin)</p>
    <p>404(Not found)</p>
    <p>500(DataBase error)</p>
      </div>
    );
  }
}

export default API