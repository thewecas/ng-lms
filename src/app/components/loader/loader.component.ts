import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div>
      <span class="loader"></span>
    </div>
  `,
  styles: [
    `
      @import '../../../styles/_colors.scss';
      div {
        width: 100%;
        height: 100%;
        display: grid;
        place-content: Center;
        position: absolute;
        z-index: 999999999;
        top: 0;
        left: 0;
        background-color: rgba($background, 0.5);
      }
      .loader {
        animation: rotate 1s infinite;
        height: 50px;
        width: 50px;
      }

      .loader:before,
      .loader:after {
        border-radius: 50%;
        content: '';
        display: block;
        height: 20px;
        width: 20px;
      }
      .loader:before {
        animation: ball1 1s infinite;
        background-color: #c9e2f4;
        box-shadow: 30px 0 0 #f9e17e;
        margin-bottom: 10px;
      }
      .loader:after {
        animation: ball2 1s infinite;
        background-color: #f9e17e;
        box-shadow: 30px 0 0 #c9e2f4;
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg) scale(0.8);
        }
        50% {
          transform: rotate(360deg) scale(1.2);
        }
        100% {
          transform: rotate(720deg) scale(0.8);
        }
      }

      @keyframes ball1 {
        0% {
          box-shadow: 30px 0 0 #f9e17e;
        }
        50% {
          box-shadow: 0 0 0 #f9e17e;
          margin-bottom: 0;
          transform: translate(15px, 15px);
        }
        100% {
          box-shadow: 30px 0 0 #f9e17e;
          margin-bottom: 10px;
        }
      }

      @keyframes ball2 {
        0% {
          box-shadow: 30px 0 0 #c9e2f4;
        }
        50% {
          box-shadow: 0 0 0 #c9e2f4;
          margin-top: -20px;
          transform: translate(15px, 15px);
        }
        100% {
          box-shadow: 30px 0 0 #c9e2f4;
          margin-top: 0;
        }
      }
    `,
  ],
})
export class LoaderComponent {}
