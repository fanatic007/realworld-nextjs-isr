import Link from "next/link";
import { useMemo } from "react";
import { PAGE_SIZE } from "../../constants";


const Pagination = ({path,itemsCount,tag,page:currentPage}:any) => {
  const pages = useMemo(()=>Array.from(Array(Math.ceil(itemsCount/PAGE_SIZE)).keys()).map((number:number)=>number+1),[itemsCount]);
  return(
    <nav>
      <ul className="pagination">
      {
        pages.map((page:number) =>
          <li className={`page-item ${page==currentPage?'active':''}`}  key={`page_${page}`}>
            <Link href={`${path}?${(tag?('tag='+tag)+'&':'')}page=${(page)}`}>
              <a className="page-link">{page}</a>
            </Link>
          </li>        
        )
      }
      </ul>
    </nav>
  );
}

export default Pagination;