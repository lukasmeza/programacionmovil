
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { $ } from 'protractor';
import jsQR from 'jsqr';
import { Usuario } from 'src/app/model/Usuario';
import { Animation, AnimationController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { DBTaskService } from '../../services/dbtask/dbtask.service'
import { AuthenticationService} from '../../services/authentication/authentication.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('titulo', { read: ElementRef, static: true}) titulo: ElementRef;
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  public usuario: Usuario;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private activeroute: ActivatedRoute,
    private router: Router,
    private qrScanner: QRScanner,
    private animationController: AnimationController,
    public dbtaskService: DBTaskService,
    public authenticationSerive:AuthenticationService
  ) {

    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!   
    };

    this.activeroute.queryParams.subscribe(params => {       
      if (this.router.getCurrentNavigation().extras.state) { 
        this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  public ngOnInit() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => status.authorized);
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;

    const animation = this.animationController
      .create()
      .addElement(this.titulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(-100%)', 'translate(100%)')
      .fromTo('opacity', 1, 0.6);

    animation.play();
  }

  // Helper functions
  async showQrToast() {
    const toast = await this.toastCtrl.create({
      // message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          // text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          },
        },
      ],
    });
    toast.present();
  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.showQrToast();
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(
        img,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.scanResult = code.data;
        this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }


  // estoeeeee
  /**
   * Antes de que se muestre la visual
   * se redirecciona a la url especifica
   */
  // ionViewWillEnter(){
  //   this.router.navigate(['home']);
  // }
  /**
   * Función que permite cerrar la sesión actual
   * actualiza el sesion_data de SQLite
   */
  logout(){
    this.authenticationSerive.logout();
  }
}
