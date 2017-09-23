import { Observable } from 'rxjs';
import { split, last, uniq, slice, splitAt } from 'ramda';
import { getDefaultChapter } from '../services/inkitt';

const handleError = error => {
  alert(error.toString());
};

export const getChapterAsync = () => dispatch => {
  Observable.from(getDefaultChapter()).subscribe(
    result => {
      console.log('result === ', result);
      dispatch({
        type: 'GET_CHAPTER_ASYNC',
        data: result
      });
    },
    error => {
      handleError(error);
    }
  );
};
