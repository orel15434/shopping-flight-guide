import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Scale, ExternalLink, ShoppingBag, PackageCheck, Package } from 'lucide-react';
import { Button } from './ui/button';

interface SearchResultItem {
  id: string;
  title: string;
  image: string;
  price: number;
  weight?: number;
  source: string;
}

interface SearchResultsProps {
  isOpen: boolean;
  results: SearchResultItem[];
  onClose: () => void;
}

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Helper function to calculate shipping cost based on weight for KAKOBUY EUB
const calculateShipping = (weight: number): number => {
  if (!weight) return 0;
  
  // Complete price chart for KAKOBUY EUB shipping
  if (weight <= 100) return 7.33;
  if (weight <= 150) return 7.79;
  if (weight <= 200) return 8.26;
  if (weight <= 250) return 8.72;
  if (weight <= 300) return 9.18;
  if (weight <= 350) return 9.64;
  if (weight <= 400) return 10.11;
  if (weight <= 450) return 10.57;
  if (weight <= 500) return 11.17;
  if (weight <= 501) return 11.18;
  if (weight <= 502) return 11.20;
  if (weight <= 503) return 11.21;
  if (weight <= 504) return 11.22;
  if (weight <= 505) return 11.23;
  if (weight <= 506) return 11.25;
  if (weight <= 507) return 11.26;
  if (weight <= 508) return 11.27;
  if (weight <= 509) return 11.29;
  if (weight <= 510) return 11.30;
  if (weight <= 511) return 11.31;
  if (weight <= 512) return 11.33;
  if (weight <= 513) return 11.34;
  if (weight <= 514) return 11.35;
  if (weight <= 515) return 11.37;
  if (weight <= 516) return 11.38;
  if (weight <= 517) return 11.39;
  if (weight <= 518) return 11.40;
  if (weight <= 519) return 11.42;
  if (weight <= 520) return 11.43;
  if (weight <= 521) return 11.44;
  if (weight <= 522) return 11.46;
  if (weight <= 523) return 11.47;
  if (weight <= 524) return 11.48;
  if (weight <= 525) return 11.50;
  if (weight <= 526) return 11.51;
  if (weight <= 527) return 11.52;
  if (weight <= 528) return 11.53;
  if (weight <= 529) return 11.55;
  if (weight <= 530) return 11.56;
  if (weight <= 531) return 11.57;
  if (weight <= 532) return 11.59;
  if (weight <= 533) return 11.60;
  if (weight <= 534) return 11.61;
  if (weight <= 535) return 11.62;
  if (weight <= 536) return 11.64;
  if (weight <= 537) return 11.65;
  if (weight <= 538) return 11.66;
  if (weight <= 539) return 11.68;
  if (weight <= 540) return 11.69;
  if (weight <= 541) return 11.70;
  if (weight <= 542) return 11.72;
  if (weight <= 543) return 11.73;
  if (weight <= 544) return 11.74;
  if (weight <= 545) return 11.75;
  if (weight <= 546) return 11.77;
  if (weight <= 547) return 11.78;
  if (weight <= 548) return 11.79;
  if (weight <= 549) return 11.81;
  if (weight <= 550) return 11.82;
  if (weight <= 551) return 11.83;
  if (weight <= 552) return 11.85;
  if (weight <= 553) return 11.86;
  if (weight <= 554) return 11.87;
  if (weight <= 555) return 11.88;
  if (weight <= 556) return 11.90;
  if (weight <= 557) return 11.91;
  if (weight <= 558) return 11.92;
  if (weight <= 559) return 11.94;
  if (weight <= 560) return 11.95;
  if (weight <= 561) return 11.96;
  if (weight <= 562) return 11.98;
  if (weight <= 563) return 11.99;
  if (weight <= 564) return 12.00;
  if (weight <= 565) return 12.02;
  if (weight <= 566) return 12.03;
  if (weight <= 567) return 12.04;
  if (weight <= 568) return 12.05;
  if (weight <= 569) return 12.07;
  if (weight <= 570) return 12.08;
  if (weight <= 571) return 12.09;
  if (weight <= 572) return 12.11;
  if (weight <= 573) return 12.12;
  if (weight <= 574) return 12.13;
  if (weight <= 575) return 12.14;
  if (weight <= 576) return 12.16;
  if (weight <= 577) return 12.17;
  if (weight <= 578) return 12.18;
  if (weight <= 579) return 12.20;
  if (weight <= 580) return 12.21;
  if (weight <= 581) return 12.22;
  if (weight <= 582) return 12.24;
  if (weight <= 583) return 12.25;
  if (weight <= 584) return 12.26;
  if (weight <= 585) return 12.27;
  if (weight <= 586) return 12.29;
  if (weight <= 587) return 12.30;
  if (weight <= 588) return 12.31;
  if (weight <= 589) return 12.33;
  if (weight <= 590) return 12.34;
  if (weight <= 591) return 12.35;
  if (weight <= 592) return 12.37;
  if (weight <= 593) return 12.38;
  if (weight <= 594) return 12.39;
  if (weight <= 595) return 12.41;
  if (weight <= 596) return 12.42;
  if (weight <= 597) return 12.43;
  if (weight <= 598) return 12.44;
  if (weight <= 599) return 12.46;
  if (weight <= 600) return 12.47;
  if (weight <= 601) return 12.48;
  if (weight <= 602) return 12.50;
  if (weight <= 603) return 12.51;
  if (weight <= 604) return 12.52;
  if (weight <= 605) return 12.54;
  if (weight <= 606) return 12.55;
  if (weight <= 607) return 12.56;
  if (weight <= 608) return 12.57;
  if (weight <= 609) return 12.59;
  if (weight <= 610) return 12.60;
  if (weight <= 611) return 12.61;
  if (weight <= 612) return 12.63;
  if (weight <= 613) return 12.64;
  if (weight <= 614) return 12.65;
  if (weight <= 615) return 12.67;
  if (weight <= 616) return 12.68;
  if (weight <= 617) return 12.69;
  if (weight <= 618) return 12.70;
  if (weight <= 619) return 12.72;
  if (weight <= 620) return 12.73;
  if (weight <= 621) return 12.74;
  if (weight <= 622) return 12.76;
  if (weight <= 623) return 12.77;
  if (weight <= 624) return 12.78;
  if (weight <= 625) return 12.79;
  if (weight <= 626) return 12.81;
  if (weight <= 627) return 12.82;
  if (weight <= 628) return 12.83;
  if (weight <= 629) return 12.85;
  if (weight <= 630) return 12.86;
  if (weight <= 631) return 12.87;
  if (weight <= 632) return 12.89;
  if (weight <= 633) return 12.90;
  if (weight <= 634) return 12.91;
  if (weight <= 635) return 12.93;
  if (weight <= 636) return 12.94;
  if (weight <= 637) return 12.95;
  if (weight <= 638) return 12.96;
  if (weight <= 639) return 12.98;
  if (weight <= 640) return 12.99;
  if (weight <= 641) return 13.00;
  if (weight <= 642) return 13.02;
  if (weight <= 643) return 13.03;
  if (weight <= 644) return 13.04;
  if (weight <= 645) return 13.06;
  if (weight <= 646) return 13.07;
  if (weight <= 647) return 13.08;
  if (weight <= 648) return 13.09;
  if (weight <= 649) return 13.11;
  if (weight <= 650) return 13.12;
  if (weight <= 651) return 13.13;
  if (weight <= 652) return 13.15;
  if (weight <= 653) return 13.16;
  if (weight <= 654) return 13.17;
  if (weight <= 655) return 13.19;
  if (weight <= 656) return 13.20;
  if (weight <= 657) return 13.21;
  if (weight <= 658) return 13.22;
  if (weight <= 659) return 13.24;
  if (weight <= 660) return 13.25;
  if (weight <= 661) return 13.26;
  if (weight <= 662) return 13.28;
  if (weight <= 663) return 13.29;
  if (weight <= 664) return 13.30;
  if (weight <= 665) return 13.32;
  if (weight <= 666) return 13.33;
  if (weight <= 667) return 13.34;
  if (weight <= 668) return 13.35;
  if (weight <= 669) return 13.37;
  if (weight <= 670) return 13.38;
  if (weight <= 671) return 13.39;
  if (weight <= 672) return 13.41;
  if (weight <= 673) return 13.42;
  if (weight <= 674) return 13.43;
  if (weight <= 675) return 13.45;
  if (weight <= 676) return 13.46;
  if (weight <= 677) return 13.47;
  if (weight <= 678) return 13.48;
  if (weight <= 679) return 13.50;
  if (weight <= 680) return 13.51;
  if (weight <= 681) return 13.52;
  if (weight <= 682) return 13.54;
  if (weight <= 683) return 13.55;
  if (weight <= 684) return 13.56;
  if (weight <= 685) return 13.57;
  if (weight <= 686) return 13.59;
  if (weight <= 687) return 13.60;
  if (weight <= 688) return 13.61;
  if (weight <= 689) return 13.63;
  if (weight <= 690) return 13.64;
  if (weight <= 691) return 13.65;
  if (weight <= 692) return 13.67;
  if (weight <= 693) return 13.68;
  if (weight <= 694) return 13.69;
  if (weight <= 695) return 13.71;
  if (weight <= 696) return 13.72;
  if (weight <= 697) return 13.73;
  if (weight <= 698) return 13.74;
  if (weight <= 699) return 13.76;
  if (weight <= 700) return 13.77;
  if (weight <= 701) return 13.78;
  if (weight <= 702) return 13.80;
  if (weight <= 703) return 13.81;
  if (weight <= 704) return 13.82;
  if (weight <= 705) return 13.84;
  if (weight <= 706) return 13.85;
  if (weight <= 707) return 13.86;
  if (weight <= 708) return 13.87;
  if (weight <= 709) return 13.89;
  if (weight <= 710) return 13.90;
  if (weight <= 711) return 13.91;
  if (weight <= 712) return 13.93;
  if (weight <= 713) return 13.94;
  if (weight <= 714) return 13.95;
  if (weight <= 715) return 13.97;
  if (weight <= 716) return 13.98;
  if (weight <= 717) return 13.99;
  if (weight <= 718) return 14.00;
  if (weight <= 719) return 14.02;
  if (weight <= 720) return 14.03;
  if (weight <= 721) return 14.04;
  if (weight <= 722) return 14.06;
  if (weight <= 723) return 14.07;
  if (weight <= 724) return 14.08;
  if (weight <= 725) return 14.10;
  if (weight <= 726) return 14.11;
  if (weight <= 727) return 14.12;
  if (weight <= 728) return 14.13;
  if (weight <= 729) return 14.15;
  if (weight <= 730) return 14.16;
  if (weight <= 731) return 14.17;
  if (weight <= 732) return 14.19;
  if (weight <= 733) return 14.20;
  if (weight <= 734) return 14.21;
  if (weight <= 735) return 14.22;
  if (weight <= 736) return 14.24;
  if (weight <= 737) return 14.25;
  if (weight <= 738) return 14.26;
  if (weight <= 739) return 14.28;
  if (weight <= 740) return 14.29;
  if (weight <= 741) return 14.30;
  if (weight <= 742) return 14.32;
  if (weight <= 743) return 14.33;
  if (weight <= 744) return 14.34;
  if (weight <= 745) return 14.36;
  if (weight <= 746) return 14.37;
  if (weight <= 747) return 14.38;
  if (weight <= 748) return 14.39;
  if (weight <= 749) return 14.41;
  if (weight <= 750) return 14.42;
  if (weight <= 751) return 14.43;
  if (weight <= 752) return 14.45;
  if (weight <= 753) return 14.46;
  if (weight <= 754) return 14.47;
  if (weight <= 755) return 14.49;
  if (weight <= 756) return 14.50;
  if (weight <= 757) return 14.51;
  if (weight <= 758) return 14.52;
  if (weight <= 759) return 14.54;
  if (weight <= 760) return 14.55;
  if (weight <= 761) return 14.56;
  if (weight <= 762) return 14.58;
  if (weight <= 763) return 14.59;
  if (weight <= 764) return 14.60;
  if (weight <= 765) return 14.62;
  if (weight <= 766) return 14.63;
  if (weight <= 767) return 14.64;
  if (weight <= 768) return 14.65;
  if (weight <= 769) return 14.67;
  if (weight <= 770) return 14.68;
  if (weight <= 771) return 14.69;
  if (weight <= 772) return 14.71;
  if (weight <= 773) return 14.72;
  if (weight <= 774) return 14.73;
  if (weight <= 775) return 14.75;
  if (weight <= 776) return 14.76;
  if (weight <= 777) return 14.77;
  if (weight <= 778) return 14.78;
  if (weight <= 779) return 14.80;
  if (weight <= 780) return 14.81;
  if (weight <= 781) return 14.82;
  if (weight <= 782) return 14.84;
  if (weight <= 783) return 14.85;
  if (weight <= 784) return 14.86;
  if (weight <= 785) return 14.88;
  if (weight <= 786) return 14.89;
  if (weight <= 787) return 14.90;
  if (weight <= 788) return 14.91;
  if (weight <= 789) return 14.93;
  if (weight <= 790) return 14.94;
  if (weight <= 791) return 14.95;
  if (weight <= 792) return 14.97;
  if (weight <= 793) return 14.98;
  if (weight <= 794) return 14.99;
  if (weight <= 795) return 15.01;
  if (weight <= 796) return 15.02;
  if (weight <= 797) return 15.03;
  if (weight <= 798) return 15.04;
  if (weight <= 799) return 15.06;
  if (weight <= 800) return 15.07;
  if (weight <= 801) return 15.08;
  if (weight <= 802) return 15.10;
  if (weight <= 803) return 15.11;
  if (weight <= 804) return 15.12;
  if (weight <= 805) return 15.14;
  if (weight <= 806) return 15.15;
  if (weight <= 807) return 15.16;
  if (weight <= 808) return 15.17;
  if (weight <= 809) return 15.19;
  if (weight <= 810) return 15.20;
  if (weight <= 811) return 15.21;
  if (weight <= 812) return 15.23;
  if (weight <= 813) return 15.24;
  if (weight <= 814) return 15.25;
  if (weight <= 815) return 15.27;
  if (weight <= 816) return 15.28;
  if (weight <= 817) return 15.29;
  if (weight <= 818) return 15.30;
  if (weight <= 819) return 15.32;
  if (weight <= 820) return 15.33;
  if (weight <= 821) return 15.34;
  if (weight <= 822) return 15.36;
  if (weight <= 823) return 15.37;
  if (weight <= 824) return 15.38;
  if (weight <= 825) return 15.40;
  if (weight <= 826) return 15.41;
  if (weight <= 827) return 15.42;
  if (weight <= 828) return 15.43;
  if (weight <= 829) return 15.45;
  if (weight <= 830) return 15.46;
  if (weight <= 831) return 15.47;
  if (weight <= 832) return 15.49;
  if (weight <= 833) return 15.50;
  if (weight <= 834) return 15.51;
  if (weight <= 835) return 15.53;
  if (weight <= 836) return 15.54;
  if (weight <= 837) return 15.55;
  if (weight <= 838) return 15.56;
  if (weight <= 839) return 15.58;
  if (weight <= 840) return 15.59;
  if (weight <= 841) return 15.60;
  if (weight <= 842) return 15.62;
  if (weight <= 843) return 15.63;
  if (weight <= 844) return 15.64;
  if (weight <= 845) return 15.66;
  if (weight <= 846) return 15.67;
  if (weight <= 847) return 15.68;
  if (weight <= 848) return 15.69;
  if (weight <= 849) return 15.71;
  if (weight <= 850) return 15.72;
  if (weight <= 851) return 15.73;
  if (weight <= 852) return 15.75;
  if (weight <= 853) return 15.76;
  if (weight <= 854) return 15.77;
  if (weight <= 855) return 15.79;
  if (weight <= 856) return 15.80;
  if (weight <= 857) return 15.81;
  if (weight <= 858) return 15.82;
  if (weight <= 859) return 15.84;
  if (weight <= 860) return 15.85;
  if (weight <= 861) return 15.86;
  if (weight <= 862) return 15.88;
  if (weight <= 863) return 15.89;
  if (weight <= 864) return 15.90;
  if (weight <= 865) return 15.92;
  if (weight <= 866) return 15.93;
  if (weight <= 867) return 15.94;
  if (weight <= 868) return 15.95;
  if (weight <= 869) return 15.97;
  if (weight <= 870) return 15.98;
  if (weight <= 871) return 15.99;
  if (weight <= 872) return 16.01;
  if (weight <= 873) return 16.02;
  if (weight <= 874) return 16.03;
  if (weight <= 875) return 16.05;
  if (weight <= 876) return 16.06;
  if (weight <= 877) return 16.07;
  if (weight <= 878) return 16.08;
  if (weight <= 879) return 16.10;
  if (weight <= 880) return 16.11;
  if (weight <= 881) return 16.12;
  if (weight <= 882) return 16.14;
  if (weight <= 883) return 16.15;
  if (weight <= 884) return 16.16;
  if (weight <= 885) return 16.18;
  if (weight <= 886) return 16.19;
  if (weight <= 887) return 16.20;
  if (weight <= 888) return 16.21;
  if (weight <= 889) return 16.23;
  if (weight <= 890) return 16.24;
  if (weight <= 891) return 16.25;
  if (weight <= 892) return 16.27;
  if (weight <= 893) return 16.28;
  if (weight <= 894) return 16.29;
  if (weight <= 895) return 16.31;
  if (weight <= 896) return 16.32;
  if (weight <= 897) return 16.33;
  if (weight <= 898) return 16.34;
  if (weight <= 899) return 16.36;
  if (weight <= 900) return 16.37;
  if (weight <= 901) return 16.38;
  if (weight <= 902) return 16.40;
  if (weight <= 903) return 16.41;
  if (weight <= 904) return 16.42;
  if (weight <= 905) return 16.44;
  if (weight <= 906) return 16.45;
  if (weight <= 907) return 16.46;
  
  return 16.46; // Default for weights over 907g
};

const SearchResults: React.FC<SearchResultsProps> = ({ isOpen, results, onClose }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transition}
    >
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.map((result) => (
            <div key={result.id}>
              <div className="flex items-center">
                <img src={result.image} alt={result.title} className="w-10 h-10 rounded-lg mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{result.title}</h3>
                  <p className="text-gray-500">Price: ${result.price.toFixed(2)}</p>
                  {result.weight && (
                    <p className="text-gray-500">Weight: {result.weight}g</p>
                  )}
                </div>
              </div>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate(result.source)}>
                  <ExternalLink className="mr-2" />
                  View on Source
                </Button>
              </CardFooter>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SearchResults;
