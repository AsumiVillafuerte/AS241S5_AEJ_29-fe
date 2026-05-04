import { Component } from '@angular/core';
import { TranslateForm } from '../../components/translate/translate-form/translate-form';
import { TranslateList } from '../../components/translate/translate-list/translate-list';
import { YoutubeList } from '../../components/youtube/youtube-list/youtube-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateForm, TranslateList, YoutubeList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  activeTab: 'translate' | 'youtube' = 'translate';
}
